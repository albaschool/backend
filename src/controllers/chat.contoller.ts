import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import * as services from "@/services/chat.service";

export const chatRoomSave = async (req: Request, res: Response) => {
  const body = req.body;
  const result = await services.createChatRoom(body);

  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    res.status(500).json({
      message: "Internal Server Error.",
    });
    return;
  }
  res.status(201).json({
    message: "채팅방 생성이 완료 됐습니다.",
  });
};

//채팅방 상세조회

export const getChatRoomDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const chatRoomDetail = { members: {}, messages: {} };
  const members = await services.getChatRoomMemebers(id);
  const messages = await services.getChatRoomMessages(id);
  if (messages.length > 0) {
    const result = await services.saveLastMessage(req.auth!.id, id, messages[messages.length - 1].id);
    if (result === BigInt(0)) {
      throw new HttpException(500, "Internal server error.");
    }
  }
  chatRoomDetail.members = members;
  chatRoomDetail.messages = messages;
  res.status(200).json({
    chatRoomDetail,
  });
};

export const setLastMessage = async (req: Request, res: Response) => {
  const body = req.body;
  const userId = req.auth!.id;
  const result = await services.saveLastMessage(userId, body.chatRoomId, body.messageId);
  if (result === BigInt(0)) {
    res.status(500).json({
      message: "Internal Server Error.",
    });
    return;
  }
  res.status(201).json({
    message: "채팅방 생성이 완료 됐습니다.",
  });
};
