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

//채팅방 목록 조회
export const getChatRooms = async (req: Request, res: Response) => {
  const user = req.auth!;
  const chatRooms = await services.getChatRooms(user.id);

  if (chatRooms.length === 0) throw new HttpException(404, "참여 중인 채팅 목록이 없습니다.");

  res.status(200).json({
    chatRooms,
  });
};
//채팅방 상세조회

export const getChatRoomDetail = async (req: Request, res: Response) => {
    const {id} = req.params;
    const  chatRoomDetail = {members : {}, messages : {}} ;
    const members = await services.getChatRoomMemebers(id);
    const messages = await services.getChatRoomMessages(id);
    console.log(members);
    chatRoomDetail.members = members;
    chatRoomDetail.messages = messages;

    res.status(200).json({  
        chatRoomDetail
    });
};

export const setLastMessage = async (req: Request, res: Response) => {
    const body = req.body;
    const userId = req.auth!.id
    const result = await services.saveLastMessage( userId, body.chatRoomId, body.messageId);
    if(result === BigInt(0)) {
        res.status(500).json({
            message: "Internal Server Error."
        })
        return;
    }
    res.status(201).json({  
        message : "채팅방 생성이 완료 됐습니다."
    });
};

