import { createSession, Session } from "better-sse";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

interface SessionMetadata {
  userId: string;
  storeId: string;
}

interface SessionData {
  session: Session;
  metadata: SessionMetadata;
}

interface Payload {
  data: unknown;
  eventName?: string;
}

export class SessionManager {
  private sessions: Map<string, SessionData>;

  constructor() {
    this.sessions = new Map();
  }

  async createSession(userId: string, req: Request, res: Response, metadata: SessionMetadata) {
    const session = await createSession(req, res);
    this.sessions.set(userId, { session, metadata });

    session.on("disconnected", () => {
      this.sessions.delete(userId);
    });

    return session;
  }

  push(session: Session, payload: Payload) {
    const { data, eventName } = payload;
    session.push(data, eventName, nanoid(12));
  }

  pushToUser(userId: string, payload: Payload) {
    const sessionData = this.sessions.get(userId);
    if (!sessionData) return;
    this.push(sessionData.session, payload);
  }

  pushToStore(storeId: string, payload: Payload) {
    Array.from(this.sessions.values())
      .filter((sessionData) => sessionData.metadata.storeId === storeId)
      .forEach((sessionData) => this.push(sessionData.session, payload));
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }
}

export const notificationsSessionManager = new SessionManager();
