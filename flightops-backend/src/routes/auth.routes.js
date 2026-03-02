"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
function createAuthRoutes(authService) {
    const router = (0, express_1.Router)();
    const controller = (0, auth_controller_1.createAuthController)(authService);
    router.post("/login", controller.login);
    router.post("/register", controller.register);
    return router;
}
//# sourceMappingURL=auth.routes.js.map