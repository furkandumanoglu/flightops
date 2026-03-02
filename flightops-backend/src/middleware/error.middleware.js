"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const aircraft_service_1 = require("../services/aircraft.service");
const auth_service_1 = require("../services/auth.service");
function errorHandler(err, _req, res, _next) {
    if (err instanceof aircraft_service_1.RecordNotFoundError) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: err.message });
        return;
    }
    if (err instanceof auth_service_1.UnauthorizedError) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: err.message });
        return;
    }
    if (err.name === "BadRequestError") {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: err.message });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: "Validation failed",
            details: err.flatten().fieldErrors,
        });
        return;
    }
    console.error("Unhandled error:", err);
    res
        .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
}
//# sourceMappingURL=error.middleware.js.map