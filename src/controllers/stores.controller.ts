import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import { AddStoreMemberPayload, CreateStorePayload } from "@/interfaces/stores.interface";
import * as services from "@/services/stores.service";
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

  res.status(201).json({ message: "가게가 생성되었습니다." });
};

/** GET /stores/me */
export const getMyStores = async (req: Request, res: Response) => {
  const stores = await services.getStores(req.auth!.id);

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

  const result = await services.updateStoreById(req.params.storeId, req.body);

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

// TODO: 비밀번호 입력 받아서 비교 필요
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
