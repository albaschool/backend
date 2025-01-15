import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateChatRoom, getChatRoom } from "@/interfaces/chat.interface";

//채팅방 생성
export const createChatRoom = async (roomInfo: CreateChatRoom) => {
  const { storeId, title } = roomInfo;
  const result = await db
    .insertInto("chatRoom")
    .values({
      id: nanoid(8),
      storeId,
      title,
    })
    .executeTakeFirst();
  return result;
};
//메시지 저장 socket controller에서 사용
export const saveMessage = async (content: string, senderId: string, roomId: string) => {
  const result = await db
    .insertInto("message")
    .values({
      id: nanoid(12),
      roomId,
      senderId,
      content,
    })
    .executeTakeFirst();
  return result;
};

//채팅방 조회
export const getChatRooms = async (userId: string) => {
  const chatRooms: getChatRoom[] = await db
    .selectFrom("chatRoom")
    .innerJoin("storeMember", "storeMember.storeId", "chatRoom.storeId")
    .select(["id", "title"])
    .where("userId", "=", userId)
    .execute();
  for (let i = 0; i < chatRooms.length; i++) {
    chatRooms[i].lastMessage = await getLastMessage(chatRooms[i].id);
  }
  console.log(chatRooms);
  return chatRooms;
};

//마지막 메시지 얻어오기
export const getLastMessage = async (chatRoomId: string) => {
  const messages = await db
    .selectFrom("message")
    .select("content")
    .where("message.roomId", "=", chatRoomId)
    .orderBy("createdAt asc")
    .execute();
  if (messages.length !== 0) return messages[messages.length - 1].content;
  else return "";
};

// 채팅방 상세조회
export const getChatRoomMessages = async (chatRoomId: string) => {
  const messages = await db
    .selectFrom("message")
    .innerJoin("user", "user.id", "message.senderId")
    .select(["content", "user.name", "user.id", "createdAt"])
    .where("roomId", "=", chatRoomId)
    .orderBy("createdAt asc")
    .execute();
  console.log(messages);
  return messages;
};

export const getChatRoomMemebers = async (chatRoomId: string) => {
  const members = await db
    .selectFrom("chatRoom")
    .innerJoin("storeMember", "storeMember.storeId", "chatRoom.storeId")
    .innerJoin("user", "storeMember.userId", "user.id")
    .select(["userId", "name"])
    .where("chatRoom.id", "=", chatRoomId)
    .execute();
  console.log(chatRoomId);

  return members;
};
