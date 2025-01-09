import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: string;
  name: string;
  role: "manager" | "staff";
}
