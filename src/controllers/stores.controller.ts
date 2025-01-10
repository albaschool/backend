import { Request, Response } from "express";

import { getAllStores } from "@/services/store.service";

export const getStores = async (_: Request, res: Response) => {
  try {
    const stores = await getAllStores();

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
    const stores = await getAllStores(req.auth!.id);

    if (stores.length === 0) {
      res.status(404).json([]);
      return;
    }

    res.status(200).json(stores);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}