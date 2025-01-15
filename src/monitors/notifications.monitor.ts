import ZongJi from "zongji";

import config from "@/config";
import logger from "@/logger";
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

      (event.rows as { [key: string]: string | number }[]).forEach((row) => {
        const payload = {
          id: row["id"],
          content: row["content"],
          title: row["title"],
          target: row["target"],
          isChecked: row["is_checked"] === 0 ? false : true,
          createdAt: row["created_at"],
        };

        sessionManager.pushToUser(row["user_id"] as string, { data: payload, eventName: "notification" });
      });
    });

    this.zongji.start({
      startAtEnd: true,
      includeSchema: {
        albaschool: ["notification"],
      },
    });
  }

  stop() {
    this.zongji.stop();
  }
}

export default NotificationMonitor;
