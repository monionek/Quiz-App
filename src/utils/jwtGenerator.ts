import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";

export interface JwtPayload {
  username: string;
  role: "admin" | "user";
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, envConfig.jwtSecret);
}
