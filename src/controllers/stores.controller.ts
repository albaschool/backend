import { Request, Response } from "express";

import {
  addStoreService,
  getStoreByIdService,
  getStoreMembersService,
  getStoresService,
  isOwnerService,
} from "@/services/stores.service";

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

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await getStoreByIdService(req.params.id);

    if (!store) {
      res.status(404).json({ message: "존재하지 않는 가게입니다." });
      return;
    }

    res.status(200).json(store);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStoreMembers = async (req: Request, res: Response) => {
  try {
    const isOwner = await isOwnerService(req.auth!.id, req.params.id);

    if (!isOwner) {
      res.status(403).json({ message: "가게 소유자만 조회할 수 있습니다." });
      return;
    }

    const members = await getStoreMembersService(req.params.id);

    if (members.length === 0) {
      res.status(404).json([]);
      return;
    }

    res.status(200).json(members);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addStore = async (req: Request, res: Response) => {
  try {
    const store = await addStoreService({
      ownerId: req.auth!.id,
      ...req.body,
    });

    res.status(201).json({ ok: (store.numInsertedOrUpdatedRows ?? 0) !== 0 });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
