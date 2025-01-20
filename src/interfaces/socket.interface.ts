export interface RecievedSocketData {
  content: string;
  roomId: string;
}
export interface SendSocketData {
  userId: string;
  name: string;
  content: string;
  roomId: string;
  messageId: string;
  createdAt : string;
}
