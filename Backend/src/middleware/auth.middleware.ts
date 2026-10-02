import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized, no access token provided" });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    console.error("ACCESS_TOKEN_SECRET is not set");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(accessToken, secret, { algorithms: ["HS256"] });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({ message: "Access token expired", code: "TOKEN_EXPIRED" });
      return;
    }
    res.status(401).json({ message: "Invalid access token" });
    return;
  }

  if (typeof decoded === "string") {
    res.status(401).json({ message: "Invalid token payload" });
    return;
  }

  req.user = decoded;
  next();
};

export default authMiddleware;
