export interface RegistRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "staff" | "manager";
  contact: string;
}
