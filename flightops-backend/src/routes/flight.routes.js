"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlightRoutes = createFlightRoutes;
const express_1 = require("express");
const flight_controller_1 = require("../controllers/flight.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
function createFlightRoutes(service) {
    const router = (0, express_1.Router)();
    const controller = (0, flight_controller_1.createFlightController)(service);
    // All flight routes require authentication
    router.use(auth_middleware_1.authenticate);
    router.post("/", controller.schedule);
    router.get("/me", controller.getMyFlights);
    return router;
}
//# sourceMappingURL=flight.routes.js.map