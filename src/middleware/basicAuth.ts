import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const AUTH_TOKEN = process.env.BASIC_AUTH_TOKEN as string;

const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (token !== AUTH_TOKEN) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }

  next();
};

export default basicAuthMiddleware;