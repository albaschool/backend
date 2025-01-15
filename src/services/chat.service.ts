import { sql } from "kysely";
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
export const saveMessage = async (content : string, senderId : string, roomId: string, messageId : string) => {
    const result = await db.insertInto('message')
            .values({ 
                id : messageId,
                roomId,
                senderId,
                content
            }).executeTakeFirst();

    return result;
}

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
    .select(["content", "user.name", "senderId", "createdAt", 'message.id'])
    .where("roomId", "=", chatRoomId)
    .orderBy("createdAt asc")
    .execute();
  return messages;
};

export const saveLastMessage = async (userId : string, roomId : string, messageId : string) =>{
    const isHere = await db.selectFrom('lastReadMessage')
                           .select( sql`1`.as('exists'))
                           .where(({ eb, and }) => 
                            and([eb("userId", "=", userId), 
                                eb("roomId", "=", roomId)]))
                            .executeTakeFirst();
    
    if (!isHere)  {
        const result = await db.insertInto('lastReadMessage')
                           .values({
                            userId,
                            roomId,
                            messageId
                           })
                           .executeTakeFirst();
        console.log(result);
        return result.numInsertedOrUpdatedRows;
    }
    else {
        const result = await db.updateTable('lastReadMessage')
        .set({
            messageId: messageId,
          })
          .where(({ eb, and }) => 
            and([eb("userId", "=", userId), 
                eb("roomId", "=", roomId)]))
          .executeTakeFirst();
        console.log(result);
        return result.numUpdatedRows;
    }

}
export const getChatRoomMemebers = async (chatRoomId: string) => {
  const members = await db
    .selectFrom("chatRoom")
    .innerJoin("storeMember", "storeMember.storeId", "chatRoom.storeId")
    .innerJoin("user", "storeMember.userId", "user.id")
    .select(["userId", "name"])
    .where("chatRoom.id", "=", chatRoomId)
    .execute();

  return members;
};
