import jwt from "jsonwebtoken";
import crypto from "crypto";
export const secret = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
};
export const signAccessToken = (userID) => {
    return jwt.sign({ id: userID }, secret("ACCESS_TOKEN_SECRET"), {
        algorithm: "HS256",
        expiresIn: "15m",
    });
};
export const signRefreshToken = (userID) => {
    return jwt.sign({ id: userID }, secret("REFRESH_TOKEN_SECRET"), {
        algorithm: "HS256",
        expiresIn: "7d",
        jwtid: crypto.randomUUID(),
    });
};
export const emailVerificationToken = (userID) => {
    return jwt.sign({ id: userID }, secret("EMAIL_VERIFICATION_SECRET"), {
        algorithm: "HS256",
        expiresIn: "1d",
    });
};
const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};
const REFRESH_PATH = "/api/users";
export const setAuthCookies = (res, req, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: 15 * 60 * 1000,
    }); // 15 minutes
    res.cookie("refreshToken", refreshToken, {
        ...baseCookieOptions,
        path: REFRESH_PATH,
        maxAge: 7 * 24 * 60 * 1000,
    }); // 7 days
};
export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", {
        ...baseCookieOptions,
    });
    res.clearCookie("refreshToken", { ...baseCookieOptions, path: REFRESH_PATH });
};
export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
//# sourceMappingURL=tokens.js.map