import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "../services/auth.service";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        fullName: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError("No token provided"));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return next(new UnauthorizedError("Invalid token format"));
    }

    const token = parts[1];
    if (!token) {
        return next(new UnauthorizedError("Invalid token format"));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as any;
        req.user = decoded;
        next();
    } catch (err) {
        next(new UnauthorizedError("Invalid or expired token"));
    }
};
