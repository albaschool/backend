import { Request, Response } from "express";

import config from "@/config";
import HttpException from "@/interfaces/http-exception.interface";
import { isOwner } from "@/services/stores.service";
import * as services from "@/services/stores-edu.service";

export const getEducations = async (req: Request, res: Response) => {
  const isStoreMember = await services.isStoreMember(req.params.storeId, req.auth!.id);
  if (!isStoreMember) {
    throw new HttpException(403, "가게가 존재하지 않거나 가게에 소속되어 있지 않습니다.");
  }

  const educations = await services.getEducationsById(req.params.storeId);
  if (educations.length === 0) {
    res.status(404).json([]);
    return;
  }

  res
    .status(200)
    .json(
      educations.map((edu) => ({
        ...edu,
        img: edu.img ? `https://${config.cloudflare.customDomain}/${edu.img}` : null,
      })),
    );
};

export const createEducation = async (req: Request, res: Response) => {
  const isStoreOwner = await isOwner(req.auth!.id, req.params.storeId);
  if (!isStoreOwner) {
    throw new HttpException(403, "가게 소유자만 생성할 수 있습니다.");
  }

  const result = await services.createEducation(
    {
      title: req.body.title,
      content: req.body.content,
      img: req.file?.buffer,
      mimeType: req.file?.mimetype,
    },
    req.params.storeId,
  );
  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error("Failed to create education");
  }

  res.status(201).json({ message: "강의 자료가 생성되었습니다." });
};

export const deleteEducation = async (req: Request, res: Response) => {
  const isStoreOwner = await isOwner(req.auth!.id, req.params.storeId);
  if (!isStoreOwner) {
    throw new HttpException(403, "가게 소유자만 삭제할 수 있습니다.");
  }

  const result = await services.deleteEducationById(req.params.eduId);
  if (!result || result.numDeletedRows === BigInt(0)) {
    throw new HttpException(404, "강의 자료가 존재하지 않습니다.");
  }

  res.status(200).json({ message: "강의 자료가 삭제되었습니다." });
};
