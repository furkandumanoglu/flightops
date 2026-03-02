import type { PrismaClient, Aircraft, AircraftStation } from "@prisma/client";
export type AircraftWithStations = Aircraft & {
    stations: AircraftStation[];
};
export interface AircraftCreateInput {
    tailNumber: string;
    model: string;
    emptyWeight: number;
    emptyWeightArm: number;
    maxTakeOffWeight: number;
    fuelCapacity: number;
    isActive?: boolean;
}
export interface AircraftUpdateInput {
    tailNumber?: string;
    model?: string;
    emptyWeight?: number;
    maxTakeOffWeight?: number;
    fuelCapacity?: number;
    isActive?: boolean;
}
export interface AircraftPayloadResult {
    aircraftId: string;
    emptyWeight: number;
    maxTakeOffWeight: number;
    availablePayload: number;
}
export declare class RecordNotFoundError extends Error {
    constructor(message?: string);
}
export declare class AircraftService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createAircraft(data: AircraftCreateInput): Promise<Aircraft>;
    getAircraftById(id: string): Promise<Aircraft>;
    listAircraft(): Promise<Aircraft[]>;
    updateAircraft(id: string, data: AircraftUpdateInput): Promise<Aircraft>;
    deleteAircraft(id: string): Promise<Aircraft>;
    /**
     * Fetches an aircraft with all its weight & balance stations.
     */
    getAircraftPerformanceData(id: string): Promise<AircraftWithStations>;
    /**
     * Calculates the available payload for an aircraft as:
     *   maxTakeOffWeight - emptyWeight
     */
    calculateAvailablePayload(aircraftId: string): Promise<AircraftPayloadResult>;
}
//# sourceMappingURL=aircraft.service.d.ts.map