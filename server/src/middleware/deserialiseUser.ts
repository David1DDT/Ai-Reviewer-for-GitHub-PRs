import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
    let token = "";

    // 1️⃣ Try header first
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
        console.log("✅ Token found in Authorization header");
    }

    // 2️⃣ Fallback to cookie
    if (!token && req.cookies.accessToken) {
        token = req.cookies.accessToken;
        console.log("✅ Token found in cookies");
    }

    if (!token) {
        console.error("❌ No token provided");
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        console.log("✅ Token verified successfully");
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}
