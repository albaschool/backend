import http from "http";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { Server } from "socket.io";

import config from "@/config";
import HttpException from "@/interfaces/http-exception.interface";
import { AuthPayload } from "@/interfaces/jwt.interface";
import { RecievedSocketData, SendSocketData } from "@/interfaces/socket.interface";
import logger from "@/logger";
import { getChatRooms, getNotiMembers, saveLastMessage, saveMessage } from "@/services/chat.service";

const usersInChatByUserId: Map<string, string> = new Map();

const usersInRoomBySocketId: Map<string, string> = new Map();
const usersInRoomByUserId : Map<string, string> = new Map();

const socket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: "*",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    path: "/socket.io",
  });

  //유효성 검사
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;  
    if (token || token.startsWith("Bearer ")) {  
      next();  
    } else {
      next(new HttpException(401, '토큰이 없습니다.')); 
    }
  });

  const chatListSocket = io.of('/chat');
  const chatRoomSocket = io.of('/room');

  chatListSocket.on("connection", async (socket)=>{
      logger.info("Client is connected in chatList space" +  socket.id);
      const token = socket.handshake.auth.token;
      const auth = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload;
      const userId = auth.id;
      const initialize = await getChatRooms(userId);
      socket.emit("initialize", {data : initialize});
      usersInChatByUserId.set(userId, socket.id);

      socket.on("disconnect", () => {
        usersInChatByUserId.delete(userId);
        logger.info("User disconnected");
      });


  })

  chatRoomSocket.on("connection", async (socket)=>{
    logger.info("Client is connected in room space" +  socket.id);
    const token = socket.handshake.auth.token;
    const auth = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload;
    const userId = auth.id;
    const initialize = await getChatRooms(userId);
    socket.emit("initialize", {data : initialize});
    usersInRoomBySocketId.set(socket.id, userId);
    usersInRoomByUserId.set(userId, socket.id);
    const userName = auth.name;

    socket.on("joinRoom", async (data, callback?) => {
      const { roomId } = data;
      try {
        socket.join(roomId);
        callback({message : "joined Ok."});
        logger.info(`${socket.id} joined in room ${roomId}`);
      } catch (error) {
        logger.error("Interal Server Error.", error);
      }
    });

    socket.on("leaveRoom", async (data) => {
      const { roomId } = data;
      try {
        socket.leave(roomId);
        logger.info(`User ${socket.id} has leaved room ${roomId}`);
      } catch (error) {
        logger.error("Interal Server Error in leavRoom.", error);
      }
    });

    socket.on("broadcast", async (data: RecievedSocketData, callback?) => {
      try {
        const { content, roomId } = data;
        logger.info(`Message received: ${content} in room ${roomId}`);
        const messageId = nanoid(12);
        const { result, createdAt } = await saveMessage(content, userId, roomId, messageId);
        if ((result.numInsertedOrUpdatedRows ?? 0) === 0) throw new HttpException(500, "Internal Server Error.");

        const message: SendSocketData = {
          content: content,
          roomId: roomId,
          userId: userId,
          name: userName,
          messageId: messageId,
          createdAt: createdAt,
        };

        io.to(roomId).emit("broadcast", message);
        callback({ message: "Ok" });

        const notificationMembers = await getNotiMembers(roomId);
        const roomSockets = await chatRoomSocket.in(roomId).fetchSockets();
        
        //채팅룸에 있는 멤버들에 한해 메시지 읽음 처리
        for (const roomSocket of roomSockets!) {
          if (usersInRoomBySocketId.has(roomSocket.id)) {
            const roomUserId = usersInRoomBySocketId.get(roomSocket.id);
            const result = await saveLastMessage(roomUserId!, roomId, messageId);
            if (result === BigInt(0)) throw new HttpException(500, "Internal Server Error. *");
          }
        }
        //소켓에 접속해 있는 전체 멤버들에게 채팅리스트 업데이트
        for (let i = 0; i < notificationMembers.length; i++) {
          const notiUserId = notificationMembers[i].userId;
          if (usersInChatByUserId.has(notiUserId)) {
            const socketId = usersInChatByUserId.get(notificationMembers[i].userId);
            const payload = await getChatRooms(notiUserId);
            console.log(socketId)
            const clientSocket = chatListSocket.sockets.get(socketId as string);
            clientSocket?.emit("chatLists", { data: payload });
          }
        }
      } catch (error) {
        logger.error("Interal Server Error. error", error);
        callback({ error: "Fail to send message." });
      }
    });

    socket.on("disconnect", () => {
      usersInRoomByUserId.delete(userId);
      usersInRoomBySocketId.delete(socket.id);
      logger.info("User disconnected");
    });

  });  
};

export default socket;
