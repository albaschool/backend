import { Request as ExpressRequest } from "express";

import { AuthPayload } from "@/interfaces/jwt.interface";

declare module "express" {
  interface Request extends ExpressRequest {
    auth?: AuthPayload;
  }
}
