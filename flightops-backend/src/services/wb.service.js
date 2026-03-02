"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightBalanceService = void 0;
const aircraft_service_1 = require("./aircraft.service");
/**
 * Weight & Balance service using standard aviation math:
 * Total Weight = aircraft.emptyWeight + sum of all loads
 * Total Moment = (aircraft.emptyWeight * aircraft.emptyWeightArm) + sum of (load * station.arm)
 * Center of Gravity = Total Moment / Total Weight
 */
class WeightBalanceService {
    aircraftService;
    constructor(aircraftService) {
        this.aircraftService = aircraftService;
    }
    /**
     * Calculates total weight and Center of Gravity for an aircraft given
     * loads at each station. loads maps station IDs to actual weights (lbs).
     */
    async calculateCG(aircraftId, loads) {
        const aircraft = await this.aircraftService.getAircraftPerformanceData(aircraftId);
        const stationMap = new Map(aircraft.stations.map((s) => [s.id, s]));
        // Validate and sum station loads; reject negative weights
        let loadsMoment = 0;
        let loadsWeight = 0;
        for (const [stationId, weight] of Object.entries(loads)) {
            const station = stationMap.get(stationId);
            if (!station) {
                throw new aircraft_service_1.RecordNotFoundError(`Station '${stationId}' not found for this aircraft`);
            }
            if (weight < 0) {
                throw new Error(`Weight at station '${stationId}' cannot be negative`);
            }
            loadsWeight += weight;
            loadsMoment += weight * station.arm;
        }
        // Standard aviation W&B
        const totalWeight = aircraft.emptyWeight + loadsWeight;
        const totalMoment = aircraft.emptyWeight * aircraft.emptyWeightArm + loadsMoment;
        const centerOfGravity = totalWeight > 0 ? totalMoment / totalWeight : 0;
        return { totalWeight, centerOfGravity };
    }
}
exports.WeightBalanceService = WeightBalanceService;
//# sourceMappingURL=wb.service.js.map