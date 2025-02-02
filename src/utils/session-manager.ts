import { createSession, Session } from "better-sse";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

interface Payload {
  data: unknown;
  eventName?: string;
}

export class SessionManager {
  private sessions: Map<string, Session[]>;

  constructor() {
    this.sessions = new Map();
  }

  async createSession(userId: string, req: Request, res: Response) {
    const session = await createSession(req, res);
    if (this.sessions.has(userId)) {
      this.sessions.get(userId)?.push(session);
    } else {
      this.sessions.set(userId, [session]);
    }

    session.on("disconnected", () => {
      const sessions = this.sessions.get(userId);
      if (!sessions) return;
      if (sessions.length <= 1) {
        this.sessions.delete(userId);
        return;
      }

      const sessionIndex = sessions.indexOf(session);
      if (sessionIndex > -1) {
        sessions.splice(sessionIndex, 1);
      }
    });

    return session;
  }

  private push(session: Session, payload: Payload) {
    const { data, eventName } = payload;
    session.push(data, eventName, nanoid(12));
  }

  pushToUser(userId: string, payload: Payload) {
    const sessions = this.sessions.get(userId);
    if (!sessions) return;
    sessions.forEach((session) => this.push(session, payload));
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }
}

export const notificationsSessionManager = new SessionManager();
