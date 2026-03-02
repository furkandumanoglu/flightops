"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlightController = createFlightController;
const http_status_codes_1 = require("http-status-codes");
const flight_service_1 = require("../services/flight.service");
function createFlightController(service) {
    return {
        async schedule(req, res, next) {
            try {
                if (!req.user) {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
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
                res.status(http_status_codes_1.StatusCodes.CREATED).json(flight);
            }
            catch (err) {
                if (err instanceof flight_service_1.ConflictError) {
                    res.status(http_status_codes_1.StatusCodes.CONFLICT).json({ message: err.message });
                    return;
                }
                next(err);
            }
        },
        async getMyFlights(req, res, next) {
            try {
                if (!req.user) {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
                    return;
                }
                const flights = await service.getPilotFlights(req.user.id);
                res.status(http_status_codes_1.StatusCodes.OK).json(flights);
            }
            catch (err) {
                next(err);
            }
        },
    };
}
//# sourceMappingURL=flight.controller.js.map