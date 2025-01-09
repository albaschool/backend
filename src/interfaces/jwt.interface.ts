export interface AuthPayload {
  id: string;
  name: string;
  role: "manager" | "staff";
  iat?: number;
  exp?: number;
}
