import { WeightBalanceService } from "./wb.service";
import type { AircraftService } from "./aircraft.service";

describe("WeightBalanceService", () => {
  const mockGetAircraftPerformanceData = jest.fn();

  const mockAircraftService = {
    getAircraftPerformanceData: mockGetAircraftPerformanceData,
  } as unknown as AircraftService;

  let service: WeightBalanceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new WeightBalanceService(mockAircraftService);
  });

  describe("calculateCG", () => {
    it("returns correct Total Weight, Total Moment, and CG for Cessna 172 (aviation math)", async () => {
      // Düzenle (Arrange)
      // Cessna 172: emptyWeight 1600 lbs, emptyWeightArm 40.0 in
      // Front Seat: arm 37.0 in, 180 lbs
      // Fuel: arm 46.0 in, 240 lbs
      const aircraftId = "cessna-172-id";
      const frontSeatId = "station-front-seat";
      const fuelId = "station-fuel";

      const mockAircraft = {
        id: aircraftId,
        tailNumber: "N172SP",
        model: "Cessna 172SP",
        emptyWeight: 1600,
        emptyWeightArm: 40.0,
        maxTakeOffWeight: 2550,
        fuelCapacity: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        stations: [
          { id: frontSeatId, name: "Front Seat", arm: 37.0, maxWeight: 400, aircraftId },
          { id: fuelId, name: "Fuel", arm: 46.0, maxWeight: null, aircraftId },
        ],
      };

      mockGetAircraftPerformanceData.mockResolvedValue(mockAircraft);

      const loads: Record<string, number> = {
        [frontSeatId]: 180,
        [fuelId]: 240,
      };

      // Expected (manual aviation math):
      // Total Weight = emptyWeight + sum(loads) = 1600 + 180 + 240 = 2020
      // Total Moment = (emptyWeight * emptyWeightArm) + (180*37) + (240*46)
      //              = 64000 + 6660 + 11040 = 81700
      // CG = 81700 / 2020 = 40.445544554455445
      const expectedTotalWeight = 2020;
      const expectedCG = 81700 / 2020;

      // Harekete Geç (Act)
      const result = await service.calculateCG(aircraftId, loads);

      // Doğrula (Assert)
      expect(mockGetAircraftPerformanceData).toHaveBeenCalledTimes(1);
      expect(mockGetAircraftPerformanceData).toHaveBeenCalledWith(aircraftId);
      expect(result.totalWeight).toBe(expectedTotalWeight);
      expect(result.centerOfGravity).toBeCloseTo(expectedCG, 10);
      expect(result.centerOfGravity).toBeCloseTo(40.445544554455445, 10);
    });

    it("throws when any load weight is negative", async () => {
      // Düzenle (Arrange)
      const aircraftId = "aircraft-1";
      const stationId = "station-1";
      mockGetAircraftPerformanceData.mockResolvedValue({
        id: aircraftId,
        emptyWeight: 1000,
        emptyWeightArm: 40,
        stations: [{ id: stationId, name: "Seat", arm: 37, maxWeight: null, aircraftId }],
      });

      const loads: Record<string, number> = { [stationId]: -50 };

      // Harekete Geç (Act)
      const act = service.calculateCG(aircraftId, loads);

      // Doğrula (Assert)
      await expect(act).rejects.toThrow(
        "Weight at station 'station-1' cannot be negative"
      );
      await expect(act).rejects.toThrow(Error);
    });
  });
});
