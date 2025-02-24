export interface CreateChatRoom {
  id: string;
  storeId: string;
  title: string;
}
export interface getChatRoom {
  title: string;
  id: string;
  lastMessage?: string;
  notReadCount?: number;
  memberCount?: number;
  createdAt?: Date;
}

export interface RoomMembers {
  userId: string;
  name: string;
}
