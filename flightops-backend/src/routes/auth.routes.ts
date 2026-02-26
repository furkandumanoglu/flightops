import { Router } from "express";
import type { AuthService } from "../services/auth.service";
import { createAuthController } from "../controllers/auth.controller";

export function createAuthRoutes(authService: AuthService): Router {
    const router = Router();
    const controller = createAuthController(authService);

    router.post("/login", controller.login);
    router.post("/register", controller.register);

    return router;
}
