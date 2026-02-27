import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FlightService, ConflictError } from "../services/flight.service";
import { AuthRequest } from "../middleware/auth.middleware";

export function createFlightController(service: FlightService) {
    return {
        async schedule(
            req: AuthRequest,
            res: Response,
            next: NextFunction
        ): Promise<void> {
            try {
                if (!req.user) {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
                    return;
                }

                const { aircraftId, instructorId, scheduledDeparture, scheduledArrival } = req.body;

                // Generate a simple flight number if not provided
                const flightNumber = `FL-${Date.now()}`;

                const flight = await service.scheduleFlight({
                    flightNumber,
                    aircraftId,
                    pilotId: req.user.id,
                    instructorId,
                    scheduledDeparture: new Date(scheduledDeparture),
                    scheduledArrival: new Date(scheduledArrival),
                });

                res.status(StatusCodes.CREATED).json(flight);
            } catch (err) {
                if (err instanceof ConflictError) {
                    res.status(StatusCodes.CONFLICT).json({ message: err.message });
                    return;
                }
                next(err);
            }
        },

        async getMyFlights(
            req: AuthRequest,
            res: Response,
            next: NextFunction
        ): Promise<void> {
            try {
                if (!req.user) {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
                    return;
                }

                const flights = await service.getPilotFlights(req.user.id);
                res.status(StatusCodes.OK).json(flights);
            } catch (err) {
                next(err);
            }
        },
    };
}
