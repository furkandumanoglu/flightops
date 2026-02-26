import { Router } from "express";
import type { AircraftService } from "../services/aircraft.service";
import type { WeightBalanceService } from "../services/wb.service";
import { createAircraftController } from "../controllers/aircraft.controller";

export function createAircraftRoutes(
  service: AircraftService,
  wbService: WeightBalanceService
): Router {
  const router = Router();
  const controller = createAircraftController(service, wbService);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id/available-payload", controller.getAvailablePayload);
  router.get("/:id", controller.getById);
  router.post("/:id/calculate-cg", controller.calculateCG);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
