"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAircraftRoutes = createAircraftRoutes;
const express_1 = require("express");
const aircraft_controller_1 = require("../controllers/aircraft.controller");
function createAircraftRoutes(service, wbService) {
    const router = (0, express_1.Router)();
    const controller = (0, aircraft_controller_1.createAircraftController)(service, wbService);
    router.post("/", controller.create);
    router.get("/", controller.list);
    router.get("/:id/available-payload", controller.getAvailablePayload);
    router.get("/:id", controller.getById);
    router.post("/:id/calculate-cg", controller.calculateCG);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.delete);
    return router;
}
//# sourceMappingURL=aircraft.routes.js.map