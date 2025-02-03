import { sql } from "kysely";
import { nanoid } from "nanoid";

import config from "@/config";
import { db } from "@/db";
import { getChatRoom, RoomMembers } from "@/interfaces/chat.interface";
import { dateFormat } from "@/utils/dateFormat";

//채팅방 생성
export const createChatRoom = async (storeId: string, title: string) => {
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
export const saveMessage = async (content: string, senderId: string, roomId: string, messageId: string) => {
  const now = new Date();
  const createdAt = dateFormat(now);
  const result = await db
    .insertInto("message")
    .values({
      id: messageId,
      roomId,
      senderId,
      content,
      createdAt,
    })
    .executeTakeFirst();
  return { result, createdAt };
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
    const { count, lastContent, createdAt } = await getLastMessageAndCount(chatRooms[i].id, userId);
    chatRooms[i].lastMessage = lastContent;
    chatRooms[i].notReadCount = count;
    chatRooms[i].createdAt = createdAt;
    chatRooms[i].memberCount = (await getChatRoomMemebers(chatRooms[i].id)).length;
  }

  chatRooms.sort((a, b) => (a.createdAt! >= b.createdAt! ? -1 : 1));

  return chatRooms;
};

//마지막 메시지 및 안읽은 채팅 갯수 가져오기
export const getLastMessageAndCount = async (chatRoomId: string, userId: string) => {
  const lastReadMessage = await db
    .selectFrom("lastReadMessage")
    .select("messageId")
    .where(({ eb, and }) => and([eb("userId", "=", userId), eb("roomId", "=", chatRoomId)]))
    .executeTakeFirst();

  const messages = await db
    .selectFrom("message")
    .selectAll()
    .where("message.roomId", "=", chatRoomId)
    .orderBy("createdAt asc")
    .execute();
  let startIdx = 0;
  if (lastReadMessage !== undefined) {
    for (let i = 0; i < messages.length; i++) {
      if (lastReadMessage?.messageId == messages[i].id) {
        startIdx = i;
        break;
      }
    }
  }

  if (messages.length !== 0)
    return {
      lastContent: messages[messages.length - 1].content,
      count: messages.length - startIdx - 1,
      createdAt: messages[messages.length - 1].createdAt,
    };
  else
    return {
      lastContent: "",
      count: messages.length - startIdx - 1,
    };
};

// 채팅방 상세조회
export const getChatRoomMessages = async (chatRoomId: string, members: RoomMembers[]) => {
  const userIds = [];
  for (let i = 0; i < members.length; i++) {
    userIds.push(members[i].userId);
  }
  const messages = await db
    .selectFrom("message")
    .innerJoin("user", "user.id", "message.senderId")
    .select(["content", "user.name", "senderId", "createdAt", "message.id"])
    .where("roomId", "=", chatRoomId)
    .orderBy("createdAt asc")
    .execute();
  for (let i = 0; i < messages.length; i++) {
    if (!userIds.includes(messages[i].senderId)) {
      messages[i].senderId = "알수없는 사용자";
    }
  }
  return messages;
};

export const saveLastMessage = async (userId: string, roomId: string, messageId: string) => {
  const isHere = await db
    .selectFrom("lastReadMessage")
    .select(sql`1`.as("exists"))
    .where(({ eb, and }) => and([eb("userId", "=", userId), eb("roomId", "=", roomId)]))
    .executeTakeFirst();

  if (!isHere) {
    const result = await db
      .insertInto("lastReadMessage")
      .values({
        userId,
        roomId,
        messageId,
      })
      .executeTakeFirst();
    return result.numInsertedOrUpdatedRows;
  } else {
    const result = await db
      .updateTable("lastReadMessage")
      .set({
        messageId: messageId,
      })
      .where(({ eb, and }) => and([eb("userId", "=", userId), eb("roomId", "=", roomId)]))
      .executeTakeFirst();
    return result.numUpdatedRows;
  }
};
export const getChatRoomMemebers = async (chatRoomId: string) => {
  const members = await db
    .selectFrom("chatRoom")
    .innerJoin("storeMember", "storeMember.storeId", "chatRoom.storeId")
    .innerJoin("user", "storeMember.userId", "user.id")
    .select(["userId", "name", "profile"])
    .where("chatRoom.id", "=", chatRoomId)
    .execute();

  return members.map(({ profile, ...member }) => ({
    ...member,
    profile: profile ? `https://${config.cloudflare.customDomain}/${profile}` : null,
  }));
};

export const getNotiMembers = async (chatRoomId: string) => {
  const members = await db
    .selectFrom("chatRoom")
    .innerJoin("storeMember", "storeMember.storeId", "chatRoom.storeId")
    .select("userId")
    .where("chatRoom.id", "=", chatRoomId)
    .execute();

  return members;
};

export const getInitialNotification = async (userId: string) => {
  const roomList = await getChatRooms(userId);
  for (let i = 0; i < roomList.length; i++) if (roomList[i].notReadCount! > 0) return true;
  return false;
};
