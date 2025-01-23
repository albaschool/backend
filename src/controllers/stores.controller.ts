import { Request, Response } from "express";

import { StoreType } from "@/interfaces/edu.interface";
import HttpException from "@/interfaces/http-exception.interface";
import { AddStoreMemberPayload, CreateStorePayload, UpdateStorePayload } from "@/interfaces/stores.interface";
import { createChatRoom } from "@/services/chat.service";
import {
  createDefaultOfAcademy,
  createDefaultOfConvenienceAndMart,
  createDefaultOfEntertainment,
  createDefaultOfRestaurantAndCafe,
  createDefaultOfSalesAndService,
} from "@/services/educationPage.service";
import * as services from "@/services/stores.service";
import { decrypt as bizRegNumDecrypt } from "@/services/validate.service";
import { comparePassword, createHashedPassword, createSalt } from "@/utils/password";

/** GET /stores */
export const getStores = async (_: Request, res: Response) => {
  const stores = await services.getStores();

  if (stores.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(stores);
};

/** POST /stores */
export const createStore = async (req: Request, res: Response) => {
  const payload: CreateStorePayload = {
    ownerId: req.auth!.id,
    ...req.body,
  };

  try {
    const decryptedBizRegistrationNum = bizRegNumDecrypt(payload.bizRegistrationNum);
    payload.bizRegistrationNum = decryptedBizRegistrationNum;
  } catch {
    throw new HttpException(400, "사업자 등록번호가 올바르지 않습니다.");
  }

  const salt = await createSalt();
  const hashedPassword = await createHashedPassword(payload.password, salt);

  const { result, storeId } = await services.createStore({
    ...payload,
    password: hashedPassword,
    salt,
  });

  if ((result.numInsertedOrUpdatedRows ?? 0) === 0) {
    throw new Error("Failed to add store");
  }

  const memberResult = await services.addStoreMember(storeId, req.auth!.id);
  if (memberResult.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error("Failed to add store member");
  }

  const chatRoomResult = await createChatRoom(storeId, req.body.title);
  if (chatRoomResult.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error("Failed to create chat room");
  }
  const type = req.body.type;
  let eduResult;
  if (type === StoreType.RetaurantAndCafe) eduResult = createDefaultOfRestaurantAndCafe(storeId);
  else if (type === StoreType.ConvenienceAndMart) eduResult = createDefaultOfConvenienceAndMart(storeId);
  else if (type === StoreType.SalesAndService) eduResult = createDefaultOfSalesAndService(storeId);
  else if (type === StoreType.Entertainment) eduResult = createDefaultOfEntertainment(storeId);
  else if (type == StoreType.Academy) eduResult = createDefaultOfAcademy(storeId);
  if (!eduResult) throw new Error("Failed to create default education page");

  res.status(201).json({ message: "가게가 생성되었습니다." });
};

/** GET /stores/me */
export const getMyStores = async (req: Request, res: Response) => {
  const stores = await services.getStoresByUserId(req.auth!.id);

  if (stores.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(stores);
};

/** GET /stores/:storeId */
export const getStoreById = async (req: Request, res: Response) => {
  const store = await services.getStoreById(req.params.storeId);

  if (!store) {
    throw new HttpException(404, "존재하지 않는 가게입니다.");
  }

  const { title, location, contact } = store;
  res.status(200).json({ title, location, contact });
};

/** PUT /stores/:storeId */
export const updateStoreById = async (req: Request, res: Response) => {
  const store = await services.getStoreById(req.params.storeId);

  if (!store) {
    throw new HttpException(404, "존재하지 않는 가게입니다.");
  }

  const isOwner = await services.isOwner(req.auth!.id, req.params.storeId);

  if (!isOwner) {
    throw new HttpException(403, "가게 소유자만 수정할 수 있습니다.");
  }

  const payload: Partial<UpdateStorePayload> = req.body;

  if (payload.password) {
    const salt = await createSalt();
    const hashedPassword = await createHashedPassword(payload.password, salt);
    payload.password = hashedPassword;
    payload.salt = salt;
  }

  const result = await services.updateStoreById(req.params.storeId, payload);

  if (result.numUpdatedRows === BigInt(0)) {
    throw new Error("Failed to update store");
  }

  res.status(200).json({ message: "가게 정보가 수정되었습니다." });
};

/** GET /stores/:storeId/members */
export const getStoreMembers = async (req: Request, res: Response) => {
  const isOwner = await services.isOwner(req.auth!.id, req.params.storeId);

  if (!isOwner) {
    throw new HttpException(403, "가게 소유자만 조회할 수 있습니다.");
  }

  const members = await services.getStoreMembers(req.params.storeId);

  if (members.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(members);
};

/** POST /stores/:storeId/members */
export const addStoreMember = async (req: Request, res: Response) => {
  if (req.auth!.role !== "staff") {
    throw new HttpException(403, "직원만 사용할 수 있습니다.");
  }

  const store = await services.getStoreById(req.params.storeId);

  if (!store) {
    throw new HttpException(404, "존재하지 않는 가게입니다.");
  }

  const { title, password, salt } = store;
  const payload: AddStoreMemberPayload = req.body;

  if (!(await comparePassword(password, payload.password, salt))) {
    throw new HttpException(401, "비밀번호가 일치하지 않습니다.");
  }

  const isMember = await services.isStoreMember(req.params.storeId, req.auth!.id);
  if (isMember) {
    throw new HttpException(409, "이미 가게에 소속되어 있습니다.");
  }

  const result = await services.addStoreMember(req.params.storeId, req.auth!.id);
  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error("Failed to add store member");
  }

  res.status(200).json({ message: `${title} 가게에 추가되었습니다.` });
};

/** DELETE /stores/:storeId/members/:userId */
export const deleteStoreMember = async (req: Request, res: Response) => {
  const isOwner = await services.isOwner(req.auth!.id, req.params.storeId);

  if (!isOwner) {
    throw new HttpException(403, "가게 소유자만 삭제할 수 있습니다.");
  }

  const result = await services.deleteStoreMember(req.params.storeId, req.params.memberId);

  if (result.numDeletedRows === BigInt(0)) {
    throw new HttpException(404, "존재하지 않는 직원입니다.");
  }

  res.status(200).json({ message: "직원이 삭제되었습니다." });
};
