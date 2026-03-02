import { Response, NextFunction } from "express";
import { FlightService } from "../services/flight.service";
import { AuthRequest } from "../middleware/auth.middleware";
export declare function createFlightController(service: FlightService): {
    schedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyFlights(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=flight.controller.d.ts.map