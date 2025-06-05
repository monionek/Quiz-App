import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
import { JwtPayload } from "../models/models";


export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;        

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = jwt.verify(token, envConfig.jwtSecret) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
