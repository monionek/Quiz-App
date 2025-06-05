import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
import { JwtPayload } from "../models/models";

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, envConfig.jwtSecret);
}
