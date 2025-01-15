import { createSession, Session } from "better-sse";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

interface Payload {
  data: unknown;
  eventName?: string;
}

export class SessionManager {
  private sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  async createSession(userId: string, req: Request, res: Response) {
    const session = await createSession(req, res);
    this.sessions.set(userId, session);

    session.on("disconnected", () => {
      this.sessions.delete(userId);
    });

    return session;
  }

  private push(session: Session, payload: Payload) {
    const { data, eventName } = payload;
    session.push(data, eventName, nanoid(12));
  }

  pushToUser(userId: string, payload: Payload) {
    const session = this.sessions.get(userId);
    if (!session) return;
    this.push(session, payload);
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }
}

export const notificationsSessionManager = new SessionManager();
