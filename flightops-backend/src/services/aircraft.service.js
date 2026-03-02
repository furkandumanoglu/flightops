"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AircraftService = exports.RecordNotFoundError = void 0;
class RecordNotFoundError extends Error {
    constructor(message = "Record Not Found") {
        super(message);
        this.name = "RecordNotFoundError";
    }
}
exports.RecordNotFoundError = RecordNotFoundError;
class AircraftService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAircraft(data) {
        return this.prisma.aircraft.create({
            data: {
                tailNumber: data.tailNumber,
                model: data.model,
                emptyWeight: data.emptyWeight,
                emptyWeightArm: data.emptyWeightArm,
                maxTakeOffWeight: data.maxTakeOffWeight,
                fuelCapacity: data.fuelCapacity,
                isActive: data.isActive ?? true,
            },
        });
    }
    async getAircraftById(id) {
        const aircraft = await this.prisma.aircraft.findUnique({ where: { id } });
        if (!aircraft) {
            throw new RecordNotFoundError(`Aircraft with id '${id}' not found`);
        }
        return aircraft;
    }
    async listAircraft() {
        return this.prisma.aircraft.findMany();
    }
    async updateAircraft(id, data) {
        // Ensure record exists to provide a consistent error shape
        await this.getAircraftById(id);
        return this.prisma.aircraft.update({
            where: { id },
            data,
        });
    }
    async deleteAircraft(id) {
        // Ensure record exists to provide a consistent error shape
        await this.getAircraftById(id);
        return this.prisma.aircraft.delete({
            where: { id },
        });
    }
    /**
     * Fetches an aircraft with all its weight & balance stations.
     */
    async getAircraftPerformanceData(id) {
        const aircraft = await this.prisma.aircraft.findUnique({
            where: { id },
            include: { stations: true },
        });
        if (!aircraft) {
            throw new RecordNotFoundError(`Aircraft with id '${id}' not found`);
        }
        return aircraft;
    }
    /**
     * Calculates the available payload for an aircraft as:
     *   maxTakeOffWeight - emptyWeight
     */
    async calculateAvailablePayload(aircraftId) {
        const aircraft = await this.getAircraftById(aircraftId);
        const availablePayload = aircraft.maxTakeOffWeight - aircraft.emptyWeight;
        return {
            aircraftId: aircraft.id,
            emptyWeight: aircraft.emptyWeight,
            maxTakeOffWeight: aircraft.maxTakeOffWeight,
            availablePayload,
        };
    }
}
exports.AircraftService = AircraftService;
//# sourceMappingURL=aircraft.service.js.map