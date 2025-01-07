import { Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  user: UserTable;
  store: StoreTable;
  storeMember: StoreMemberTable;
  chatRoom: ChatRoomTable;
  chatRoomMember: ChatRoomMemberTable;
  message: MessageTable;
  schedule: ScheduleTable;
  educationPage: EducationPageTable;
  verification: VerificationTable;
}

export interface UserTable {
  id: string;
  email: string;
  password: string;
  name: string;
  contact: string;
  role: "MANAGER" | "STAFF";
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface StoreTable {
  id: string;
  ownerId: string;
  title: string;
  location: string;
  contact: string;
  password: string;
  createdAt: Date;
}

export type Store = Selectable<StoreTable>;
export type NewStore = Insertable<StoreTable>;
export type StoreUpdate = Updateable<StoreTable>;

export interface StoreMemberTable {
  userId: string;
  storeId: string;
}

export type StoreMember = Selectable<StoreMemberTable>;
export type NewStoreMember = Insertable<StoreMemberTable>;
export type StoreMemberUpdate = Updateable<StoreMemberTable>;

export interface ChatRoomTable {
  id: string;
  storeId: string;
  title: string;
}

export type ChatRoom = Selectable<ChatRoomTable>;
export type NewChatRoom = Insertable<ChatRoomTable>;
export type ChatRoomUpdate = Updateable<ChatRoomTable>;

export interface ChatRoomMemberTable {
  roomId: string;
  userId: string;
}

export type ChatRoomMember = Selectable<ChatRoomMemberTable>;
export type NewChatRoomMember = Insertable<ChatRoomMemberTable>;
export type ChatRoomMemberUpdate = Updateable<ChatRoomMemberTable>;

export interface MessageTable {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type MessageUpdate = Updateable<MessageTable>;

export interface ScheduleTable {
  id: string;
  userId: string;
  storeId: string;
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

export type Schedule = Selectable<ScheduleTable>;
export type NewSchedule = Insertable<ScheduleTable>;
export type ScheduleUpdate = Updateable<ScheduleTable>;

export interface EducationPageTable {
  id: string;
  storeId: string;
  title: string;
  content: string;
  img: string;
}

export type EducationPage = Selectable<EducationPageTable>;
export type NewEducationPage = Insertable<EducationPageTable>;
export type EducationPageUpdate = Updateable<EducationPageTable>;

export interface VerificationTable {
  userName: string;
  userEmail: string;
  verificationCode: string;
}

export type Verification = Selectable<VerificationTable>;
export type NewVerification = Insertable<VerificationTable>;
export type VerificationUpdate = Updateable<VerificationTable>;
