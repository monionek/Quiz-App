import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

export const valResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
    return;
  }
  next();
};
