import { Request, Response } from "express";

import { getAllStores } from "@/services/store.service";

export const getStores = async (_: Request, res: Response) => {
  try {
    const stores = await getAllStores();

    if (stores.length === 0) {
      res.status(404).json({ message: "가게가 존재하지 않습니다." });
      return;
    }

    res.status(200).json(stores);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};