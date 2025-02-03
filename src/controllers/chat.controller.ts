import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import * as services from "@/services/chat.service";

//채팅방 상세조회

export const getChatRoomDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = req.query.page as string;
  const messageId = req.query.messageId as string;
  const chatRoomDetail = { members: {}, messages: {} };
  const members = await services.getChatRoomMemebers(id);
  const messages = await services.getChatRoomMessages(id, members, page, messageId);
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
