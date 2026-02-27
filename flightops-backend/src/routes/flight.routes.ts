import { Router } from "express";
import { FlightService } from "../services/flight.service";
import { createFlightController } from "../controllers/flight.controller";
import { authenticate } from "../middleware/auth.middleware";

export function createFlightRoutes(service: FlightService): Router {
    const router = Router();
    const controller = createFlightController(service);

    // All flight routes require authentication
    router.use(authenticate as any);

    router.post("/", controller.schedule as any);
    router.get("/me", controller.getMyFlights as any);

    return router;
}
