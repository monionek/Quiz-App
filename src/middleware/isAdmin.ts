import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access only" });
    return;
  }
  next();
};
