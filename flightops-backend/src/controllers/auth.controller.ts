import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import type { AuthService } from "../services/auth.service";

export function createAuthController(authService: AuthService) {
    return {
        async login(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const { email, password } = req.body;
                const result = await authService.login(email, password);
                res.status(StatusCodes.OK).json(result);
            } catch (err) {
                next(err);
            }
        },

        async register(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const { email, password, fullName, role } = req.body;
                const user = await authService.register({
                    email,
                    passwordHash: password,
                    fullName,
                    role,
                });
                res.status(StatusCodes.CREATED).json(user);
            } catch (err) {
                next(err);
            }
        },
    };
}
