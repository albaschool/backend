import ZongJi from "zongji";

import config from "@/config";
import logger from "@/logger";
import { getChatRoomMemebers } from "@/services/chat.service";
import { notificationsSessionManager as sessionManager } from "@/utils/session-manager";
class NotificationMonitor {
  private zongji: ZongJi;

  constructor() {
    this.zongji = new ZongJi(config.database.url);
  }

  start() {
    this.zongji.on("ready", () => {
      logger.info("Notification monitoring started.");
    });

    this.zongji.on("binlog", (event) => {
      if (event.getEventName() !== "writerows") return;

      (event.rows as { [key: string]: string | number }[]).forEach(async (row) => {
        let eventName: string;
        let payload;
        let sendToId: string;
        if (row["target"] === undefined) {
          const roomId = row["room_id"];

          const users = await getChatRoomMemebers(roomId as string);
          eventName = "chatNotification";
          payload = { isNewMessage: true };
          for (let i = 0; i < users.length; i++) {
            sendToId = users[i].userId;
            sessionManager.pushToUser(sendToId as string, { data: payload, eventName: eventName });
          }
        } else {
          payload = {
            id: row["id"],
            content: row["content"],
            title: row["title"],
            target: row["target"],
            isChecked: row["is_checked"] === 0 ? false : true,
            createdAt: row["created_at"],
          };
          eventName = "notification";
          sendToId = row["user_id"] as string;
          sessionManager.pushToUser(sendToId as string, { data: payload, eventName: eventName });
        }
      });
    });

    this.zongji.start({
      startAtEnd: true,
      includeSchema: {
        albaschool: ["notification", "message"],
      },
    });
  }

  stop() {
    this.zongji.stop();
  }
}

export default NotificationMonitor;
