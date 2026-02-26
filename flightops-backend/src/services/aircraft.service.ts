import type { PrismaClient, Aircraft, AircraftStation } from "@prisma/client";

export type AircraftWithStations = Aircraft & { stations: AircraftStation[] };

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

export class RecordNotFoundError extends Error {
  constructor(message = "Record Not Found") {
    super(message);
    this.name = "RecordNotFoundError";
  }
}

export class AircraftService {
  constructor(private readonly prisma: PrismaClient) {}

  async createAircraft(data: AircraftCreateInput): Promise<Aircraft> {
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

  async getAircraftById(id: string): Promise<Aircraft> {
    const aircraft = await this.prisma.aircraft.findUnique({ where: { id } });
    if (!aircraft) {
      throw new RecordNotFoundError(`Aircraft with id '${id}' not found`);
    }
    return aircraft;
  }

  async listAircraft(): Promise<Aircraft[]> {
    return this.prisma.aircraft.findMany();
  }

  async updateAircraft(id: string, data: AircraftUpdateInput): Promise<Aircraft> {
    // Ensure record exists to provide a consistent error shape
    await this.getAircraftById(id);

    return this.prisma.aircraft.update({
      where: { id },
      data,
    });
  }

  async deleteAircraft(id: string): Promise<Aircraft> {
    // Ensure record exists to provide a consistent error shape
    await this.getAircraftById(id);

    return this.prisma.aircraft.delete({
      where: { id },
    });
  }

  /**
   * Fetches an aircraft with all its weight & balance stations.
   */
  async getAircraftPerformanceData(id: string): Promise<AircraftWithStations> {
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
  async calculateAvailablePayload(aircraftId: string): Promise<AircraftPayloadResult> {
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

