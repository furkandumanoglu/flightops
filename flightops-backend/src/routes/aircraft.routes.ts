import { Router } from "express";
import type { AircraftService } from "../services/aircraft.service";
import { createAircraftController } from "../controllers/aircraft.controller";

export function createAircraftRoutes(service: AircraftService): Router {
  const router = Router();
  const controller = createAircraftController(service);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id/available-payload", controller.getAvailablePayload);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
