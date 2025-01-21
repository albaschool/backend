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

const socket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  const socketListByUserId: Map<string, string> = new Map();
  const userListBySocketId: Map<string, string> = new Map();

  io.on("connection", async (socket) => {
    logger.info("Client is connected", socket.id);
    const token = socket.handshake.auth.token;
    if (!token || !token.startsWith("Bearer ")) {
      socket.disconnect();
      throw new HttpException(401, "토큰을 찾을 수 없습니다.");
    }
    const auth = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload;
    const userId = auth.id;
    const initialize = await getChatRooms(userId);
    socket.emit("initailize", { data: initialize });
    socketListByUserId.set(userId, socket.id);
    userListBySocketId.set(socket.id, userId);

    const userName = auth.name;
    socket.on("joinRoom", async (data) => {
      const { roomId } = data;
      try {
        socket.join(roomId);
        logger.info(`${socket.id} joined in room ${roomId}`);
      } catch (error) {
        logger.error("Interal Server Error.", error);
      }
    });

    socket.on("leaveRoom", async (data) => {
      const { roomId } = data;
      console.log(`User ${socket.id} is leaving room: ${roomId}`);

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
        const inRoomMembers = io.sockets.adapter.rooms.get(roomId);

        //채팅룸에 있는 멤버들에 한해 메시지 읽음 처리
        for (const clientSocket of inRoomMembers!) {
          if (userListBySocketId.has(clientSocket)) {
            const inRoomUserId = userListBySocketId.get(clientSocket);
            const result = await saveLastMessage(inRoomUserId!, roomId, messageId);
            if (result === BigInt(0)) throw new HttpException(500, "Internal Server Error.");
          }
        }
        //소켓에 접속해 있는 전체 멤버들에게 채팅리스트 업데이트
        for (const notiMember of notificationMembers) {
          const notiUserId = notiMember.userId;
          const socketId = socketListByUserId.get(notiUserId);

          if (socketId && ! inRoomMembers?.has(socketId)) {
            const payload = await getChatRooms(notiUserId);
            console.log(notiUserId, payload);
            const clientSocket = io.sockets.sockets.get(socketId as string);
            clientSocket?.emit("chatLists", { data: payload });
          }
        }
      } catch (error) {
        logger.error("Interal Server Error.", error);
        callback({ error: "Fail to send message." });
      }
    });

    socket.on("disconnect", () => {
      socketListByUserId.delete(userId);
      userListBySocketId.delete(socket.id);
      logger.info("User disconnected", socket.id);
    });
  });
};

export default socket;
