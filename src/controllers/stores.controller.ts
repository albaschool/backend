import { Request, Response } from "express";

import {
  addStoreMemberService,
  createStoreService,
  deleteStoreMemberService,
  getStoreByIdService,
  getStoreMembersService,
  getStoresService,
  isOwnerService,
  isStoreMemberService,
  isUserExistsService,
} from "@/services/stores.service";

/** GET /stores */
export const getStores = async (_: Request, res: Response) => {
  try {
    const stores = await getStoresService();

    if (stores.length === 0) {
      res.status(404).json([]);
      return;
    }

    res.status(200).json(stores);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** POST /stores */
export const createStore = async (req: Request, res: Response) => {
  try {
    const store = await createStoreService({
      ownerId: req.auth!.id,
      ...req.body,
    });

    if ((store.numInsertedOrUpdatedRows ?? 0) !== 0) {
      throw new Error("Failed to add store");
    }

    res.status(201).json({ message: "가게가 생성되었습니다." });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** GET /stores/me */
export const getMyStores = async (req: Request, res: Response) => {
  try {
    const stores = await getStoresService(req.auth!.id);

    if (stores.length === 0) {
      res.status(404).json([]);
      return;
    }

    res.status(200).json(stores);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** GET /stores/:storeId */
export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await getStoreByIdService(req.params.storeId);

    if (!store) {
      res.status(404).json({ message: "존재하지 않는 가게입니다." });
      return;
    }

    res.status(200).json(store);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** GET /stores/:storeId/members */
export const getStoreMembers = async (req: Request, res: Response) => {
  try {
    const isOwner = await isOwnerService(req.auth!.id, req.params.storeId);

    if (!isOwner) {
      res.status(403).json({ message: "가게 소유자만 조회할 수 있습니다." });
      return;
    }

    const members = await getStoreMembersService(req.params.storeId);

    if (members.length === 0) {
      res.status(404).json([]);
      return;
    }

    res.status(200).json(members);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** POST /stores/:storeId/members */
export const addStoreMember = async (req: Request, res: Response) => {
  try {
    const isOwner = await isOwnerService(req.auth!.id, req.params.storeId);
    if (!isOwner) {
      res.status(403).json({ message: "가게 소유자만 추가할 수 있습니다." });
      return;
    }

    const memberId = req.body.memberId;

    const isMember = await isStoreMemberService(memberId, req.params.storeId);
    if (isMember) {
      res.status(409).json({ message: "이미 존재하는 직원입니다." });
      return;
    }

    const isUserExists = await isUserExistsService(memberId);
    if (!isUserExists) {
      res.status(404).json({ message: "존재하지 않는 직원입니다." });
      return;
    }

    const result = await addStoreMemberService(req.params.storeId, memberId);
    if (result.numInsertedOrUpdatedRows === BigInt(0)) {
      throw new Error("Failed to add store member");
    }

    res.status(200).json({ message: "직원이 추가되었습니다." });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/** DELETE /stores/:storeId/members/:memberId */
export const deleteStoreMember = async (req: Request, res: Response) => {
  try {
    const isOwner = await isOwnerService(req.auth!.id, req.params.storeId);

    if (!isOwner) {
      res.status(403).json({ message: "가게 소유자만 삭제할 수 있습니다." });
      return;
    }

    const result = await deleteStoreMemberService(req.params.storeId, req.params.memberId);

    if (result.numDeletedRows === BigInt(0)) {
      res.status(404).json({ message: "존재하지 않는 직원입니다." });
      return;
    }

    res.status(200).json({ message: "직원이 삭제되었습니다." });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
