import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import config from '@/config';
import HttpException from '@/interfaces/http-exception.interface';
import { AuthPayload } from '@/interfaces/jwt.interface';
import { RecievedSocketData, SendSocketData } from '@/interfaces/socket.interface';
import logger from '@/logger';
import { saveMessage } from '@/services/chat.service';


const socket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ['Content-Type', 'Authorization'],
          credentials: true,
        }
      });
      console.log(-1);
      io.on("connection", (socket) => {
        logger.info("Client is connected", socket.id);
        const token = socket.handshake.auth.token;
        console.log(token);
        if (!token || !token.startsWith("Bearer ")) {
            socket.disconnect();
            throw new HttpException(401, "토큰을 찾을 수 없습니다.");
          }
        
          
        const auth = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload; 

        
        const userId = auth.id;
        const userName = auth.name;
        socket.on("joinRoom", async (data) => {
          const { roomId } = data;
        
          try {
            socket.join(roomId);        
            logger.info(`${socket.id} joined in room ${roomId}`);
          } catch (error) {
            logger.error("Interal Server Error.", error)

          }
        });
    
        socket.on("leaveRoom", async (data) => {
          const { roomId } = data;
          console.log(`User ${socket.id} is leaving room: ${roomId}`);
    
          try {
            socket.leave(roomId);
            logger.info(`User ${socket.id} has leaved room ${roomId}`);
          } catch (error) {
                logger.error("Interal Server Error.", error)
          }
        });
    
        socket.on("sendMessage", async (data: RecievedSocketData) => {
          try {
            const { content, roomId } = data;
            console.log(`Message received: ${content} in room ${roomId}`);
    
            const result = await saveMessage(content, userId, roomId);
            const message : SendSocketData= {content : content, roomId : roomId, userId : userId, name: userName};
            if((result.numInsertedOrUpdatedRows ?? 0) === 0)
                throw new Error()
            io.to(roomId).emit("message", message);
    
            
          } catch (error) {
            logger.error("Interal Server Error.", error)
          }
        });
    
        socket.on("disconnect", () => {
          console.log("User disconnected", socket.id);
        });
      
      });
    };

export default socket;