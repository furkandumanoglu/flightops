import { Request, Response, NextFunction } from "express";
import type { AuthService } from "../services/auth.service";
export declare function createAuthController(authService: AuthService): {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map