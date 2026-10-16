import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string };
}

const sendUnauthorized = (
  res: Response,
  message: string,
  code?: string,
): void => {
  res.status(401).json({ message, ...(code && { code }) });
};

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    sendUnauthorized(res, "Unauthorized, no access token provided");
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
      sendUnauthorized(res, "Access token expired", "TOKEN_EXPIRED");
    } else {
      sendUnauthorized(res, "Invalid access token");
    }
    return;
  }

  if (typeof decoded === "string") {
    sendUnauthorized(res, "Invalid token payload");
    return;
  }

  const userId = [decoded.id, decoded.userID].find(
    (value): value is string => typeof value === "string",
  );
  if (!userId) {
    sendUnauthorized(res, "Invalid token payload");
    return;
  }

  req.user = { ...decoded, id: userId };
  next();
};

export default authMiddleware;
