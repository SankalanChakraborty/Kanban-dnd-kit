import jwt from "jsonwebtoken";
const sendUnauthorized = (res, message, code) => {
    res
        .status(401)
        .json({ isAuthenticated: false, message, ...(code && { code }) });
};
const authMiddleware = (req, res, next) => {
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
    let decoded;
    try {
        decoded = jwt.verify(accessToken, secret, { algorithms: ["HS256"] });
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            sendUnauthorized(res, "Access token expired", "TOKEN_EXPIRED");
        }
        else {
            sendUnauthorized(res, "Invalid access token");
        }
        return;
    }
    if (typeof decoded === "string") {
        sendUnauthorized(res, "Invalid token payload");
        return;
    }
    const userId = [decoded.id, decoded.userID].find((value) => typeof value === "string");
    if (!userId) {
        sendUnauthorized(res, "Invalid token payload");
        return;
    }
    req.user = { ...decoded, id: userId };
    next();
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map