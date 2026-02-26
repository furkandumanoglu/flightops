import type { Aircraft } from "@prisma/client";
import { AircraftService, RecordNotFoundError } from "./aircraft.service";

describe("AircraftService", () => {
  const mockFindUnique = jest.fn();

  const mockPrisma = {
    aircraft: {
      findUnique: mockFindUnique,
    },
  } as unknown as import("@prisma/client").PrismaClient;

  let service: AircraftService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AircraftService(mockPrisma);
  });

  describe("calculateAvailablePayload", () => {
    it("returns correct available payload (MTOW - emptyWeight)", async () => {
      // Düzenle (Arrange)
      const aircraftId = "aircraft-123";
      const emptyWeight = 800;
      const maxTakeOffWeight = 1200;
      const expectedAvailablePayload = maxTakeOffWeight - emptyWeight; // 400

      const mockAircraft: Aircraft = {
        id: aircraftId,
        tailNumber: "TC-FRO",
        model: "Cessna 172SP",
        emptyWeight,
        maxTakeOffWeight,
        fuelCapacity: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFindUnique.mockResolvedValue(mockAircraft);

      // Harekete Geç (Act)
      const result = await service.calculateAvailablePayload(aircraftId);

      // Doğrula (Assert)
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: aircraftId } });
      expect(result.aircraftId).toBe(aircraftId);
      expect(result.emptyWeight).toBe(emptyWeight);
      expect(result.maxTakeOffWeight).toBe(maxTakeOffWeight);
      expect(result.availablePayload).toBe(expectedAvailablePayload);
      expect(result.availablePayload).toBe(400);
    });
  });

  describe("getAircraftById", () => {
    it("throws RecordNotFoundError when aircraft does not exist", async () => {
      // Düzenle (Arrange)
      const nonExistentId = "non-existent-id";
      mockFindUnique.mockResolvedValue(null);

      // Harekete Geç (Act)
      const act = service.getAircraftById(nonExistentId);

      // Doğrula (Assert)
      await expect(act).rejects.toThrow(RecordNotFoundError);
      await expect(act).rejects.toThrow(
        `Aircraft with id '${nonExistentId}' not found`
      );
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: nonExistentId },
      });
    });
  });
});
