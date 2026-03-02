import { PrismaClient } from "@prisma/client";
export declare class ConflictError extends Error {
    constructor(message: string);
}
export declare class BadRequestError extends Error {
    constructor(message: string);
}
export interface FlightCreateInput {
    flightNumber: string;
    aircraftId: string;
    pilotId: string;
    instructorId?: string;
    scheduledDeparture: Date;
    scheduledArrival: Date;
}
export declare class FlightService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    scheduleFlight(data: FlightCreateInput): Promise<{
        aircraft: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tailNumber: string;
            model: string;
            emptyWeight: number;
            emptyWeightArm: number;
            maxTakeOffWeight: number;
            fuelCapacity: number;
            isActive: boolean;
            status: import(".prisma/client").$Enums.AircraftStatus;
            nextMaintenanceHours: number;
        };
        pilot: {
            id: string;
            email: string;
            fullName: string;
        };
        instructor: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FlightStatus;
        aircraftId: string;
        centerOfGravity: number | null;
        flightNumber: string;
        scheduledDeparture: Date;
        scheduledArrival: Date;
        pilotId: string;
        instructorId: string | null;
        takeOffWeight: number | null;
    }>;
    getPilotFlights(pilotId: string): Promise<({
        aircraft: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tailNumber: string;
            model: string;
            emptyWeight: number;
            emptyWeightArm: number;
            maxTakeOffWeight: number;
            fuelCapacity: number;
            isActive: boolean;
            status: import(".prisma/client").$Enums.AircraftStatus;
            nextMaintenanceHours: number;
        };
        instructor: {
            id: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FlightStatus;
        aircraftId: string;
        centerOfGravity: number | null;
        flightNumber: string;
        scheduledDeparture: Date;
        scheduledArrival: Date;
        pilotId: string;
        instructorId: string | null;
        takeOffWeight: number | null;
    })[]>;
}
//# sourceMappingURL=flight.service.d.ts.map