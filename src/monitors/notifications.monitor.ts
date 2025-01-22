import ZongJi from "zongji";

import config from "@/config";
import logger from "@/logger";
import { getChatRooms } from "@/services/chat.service";
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
        if (row["id"] === undefined) {
          const userId = row["user_id"];
          console.log(userId);
          payload = await getChatRooms(userId as string);
          eventName = "chatNotification";
          sendToId = row["user_id"] as string;
          console.log(payload);
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
        }
        console.log(sendToId);

        sessionManager.pushToUser(sendToId as string, { data: payload, eventName: eventName });
      });
    });

    this.zongji.start({
      startAtEnd: true,
      includeSchema: {
        albaschool: ["notification", "chat_notification"],
      },
    });
  }

  stop() {
    this.zongji.stop();
  }
}

export default NotificationMonitor;
