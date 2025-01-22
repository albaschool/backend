export interface RecievedSocketData {
  content: string;
  roomId: string;
}
export interface SendSocketData {
  senderId: string;
  name: string;
  content: string;
  roomId: string;
  messageId: string;
  createdAt: string;
}
