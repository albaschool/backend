import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  user: UserTable;
  store: StoreTable;
  storeMember: StoreMemberTable;
  chatRoom: ChatRoomTable;
  message: MessageTable;
  lastReadMessage: LastReadMessageTable;
  schedule: ScheduleTable;
  educationPage: EducationPageTable;
  verification: VerificationTable;
  notification: NotificationTable;
}

export interface UserTable {
  id: string;
  email: string;
  password: string;
  name: string;
  contact: string;
  role: "manager" | "staff";
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
  openTime: string;
  closeTime: string;
  createdAt: ColumnType<Date, string | undefined, never>;
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

export interface MessageTable {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type MessageUpdate = Updateable<MessageTable>;

export interface LastReadMessageTable {
  userId: string;
  chatRoomId: string;
  messageId: string;
}

export type LastReadMessage = Selectable<LastReadMessageTable>;
export type NewLastReadMessage = Insertable<LastReadMessageTable>;
export type LastReadMessageUpdate = Updateable<LastReadMessageTable>;

export interface ScheduleTable {
  id: string;
  userId: string;
  storeId: string;
  content: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Schedule = Selectable<ScheduleTable>;
export type NewSchedule = Insertable<ScheduleTable>;
export type ScheduleUpdate = Updateable<ScheduleTable>;

export interface EducationPageTable {
  id: string;
  storeId: string;
  title: string;
  content: string;
  img: string | null;
}

export type EducationPage = Selectable<EducationPageTable>;
export type NewEducationPage = Insertable<EducationPageTable>;
export type EducationPageUpdate = Updateable<EducationPageTable>;

export interface VerificationTable {
  email: string;
  code: string;
}

export type Verification = Selectable<VerificationTable>;
export type NewVerification = Insertable<VerificationTable>;
export type VerificationUpdate = Updateable<VerificationTable>;

export interface NotificationTable {
  id: string;
  userId: string;
  title: string;
  content: string;
  target: string;
  isChecked: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Notification = Selectable<NotificationTable>;
export type NewNotification = Insertable<NotificationTable>;
export type NotificationUpdate = Updateable<NotificationTable>;
