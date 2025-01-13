import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import * as services from "@/services/stores.service";

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
  const store = await services.createStore({
    ownerId: req.auth!.id,
    ...req.body,
  });

  if ((store.numInsertedOrUpdatedRows ?? 0) !== 0) {
    throw new Error("Failed to add store");
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

  res.status(200).json(store);
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
  const isOwner = await services.isOwner(req.auth!.id, req.params.storeId);
  if (!isOwner) {
    throw new HttpException(403, "가게 소유자만 조회할 수 있습니다.");
  }

  const memberId = req.body.memberId;

  const isMember = await services.isStoreMember(memberId, req.params.storeId);
  if (isMember) {
    throw new HttpException(409, "이미 존재하는 직원입니다.");
  }

  const isUserExists = await services.isUserExists(memberId);
  if (!isUserExists) {
    throw new HttpException(404, "존재하지 않는 직원입니다.");
  }

  const result = await services.addStoreMember(req.params.storeId, memberId);
  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error("Failed to add store member");
  }

  res.status(200).json({ message: "직원이 추가되었습니다." });
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
    return;
  }

  res.status(200).json({ message: "직원이 삭제되었습니다." });
};
