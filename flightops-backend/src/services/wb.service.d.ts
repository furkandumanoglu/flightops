import type { AircraftService } from "./aircraft.service";
export interface CGResult {
    totalWeight: number;
    centerOfGravity: number;
}
/**
 * Weight & Balance service using standard aviation math:
 * Total Weight = aircraft.emptyWeight + sum of all loads
 * Total Moment = (aircraft.emptyWeight * aircraft.emptyWeightArm) + sum of (load * station.arm)
 * Center of Gravity = Total Moment / Total Weight
 */
export declare class WeightBalanceService {
    private readonly aircraftService;
    constructor(aircraftService: AircraftService);
    /**
     * Calculates total weight and Center of Gravity for an aircraft given
     * loads at each station. loads maps station IDs to actual weights (lbs).
     */
    calculateCG(aircraftId: string, loads: Record<string, number>): Promise<CGResult>;
}
//# sourceMappingURL=wb.service.d.ts.map