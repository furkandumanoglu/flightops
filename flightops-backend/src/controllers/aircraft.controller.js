"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAircraftController = createAircraftController;
const http_status_codes_1 = require("http-status-codes");
const aircraft_schema_1 = require("../validations/aircraft.schema");
function createAircraftController(service, wbService) {
    return {
        async create(req, res, next) {
            try {
                const parsed = aircraft_schema_1.createAircraftSchema.parse(req.body);
                const aircraft = await service.createAircraft({
                    ...parsed,
                    isActive: parsed.isActive ?? true,
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json(aircraft);
            }
            catch (err) {
                next(err);
            }
        },
        async getById(req, res, next) {
            try {
                const id = req.params.id;
                const aircraft = await service.getAircraftPerformanceData(id);
                res.status(http_status_codes_1.StatusCodes.OK).json(aircraft);
            }
            catch (err) {
                next(err);
            }
        },
        async list(req, res, next) {
            try {
                const aircraft = await service.listAircraft();
                res.status(http_status_codes_1.StatusCodes.OK).json(aircraft);
            }
            catch (err) {
                next(err);
            }
        },
        async update(req, res, next) {
            try {
                const id = req.params.id;
                const aircraft = await service.updateAircraft(id, req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json(aircraft);
            }
            catch (err) {
                next(err);
            }
        },
        async delete(req, res, next) {
            try {
                const id = req.params.id;
                await service.deleteAircraft(id);
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
            }
            catch (err) {
                next(err);
            }
        },
        async getAvailablePayload(req, res, next) {
            try {
                const id = req.params.id;
                const result = await service.calculateAvailablePayload(id);
                res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (err) {
                next(err);
            }
        },
        async calculateCG(req, res, next) {
            try {
                const id = req.params.id;
                const { loads } = req.body;
                const result = await wbService.calculateCG(id, loads);
                res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (err) {
                next(err);
            }
        },
    };
}
//# sourceMappingURL=aircraft.controller.js.map