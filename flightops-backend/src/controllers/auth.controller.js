"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthController = createAuthController;
const http_status_codes_1 = require("http-status-codes");
function createAuthController(authService) {
    return {
        async login(req, res, next) {
            try {
                const { email, password } = req.body;
                const result = await authService.login(email, password);
                res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (err) {
                next(err);
            }
        },
        async register(req, res, next) {
            try {
                const { email, password, fullName, role } = req.body;
                const user = await authService.register({
                    email,
                    passwordHash: password,
                    fullName,
                    role,
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json(user);
            }
            catch (err) {
                next(err);
            }
        },
    };
}
//# sourceMappingURL=auth.controller.js.map