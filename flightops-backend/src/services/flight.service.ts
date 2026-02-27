import { PrismaClient, FlightStatus } from "@prisma/client";
import { RecordNotFoundError } from "./aircraft.service";

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export interface FlightCreateInput {
    flightNumber: string;
    aircraftId: string;
    pilotId: string;
    instructorId?: string;
    scheduledDeparture: Date;
    scheduledArrival: Date;
}

export class FlightService {
    constructor(private readonly prisma: PrismaClient) { }

    async scheduleFlight(data: FlightCreateInput) {
        // 1. Check if aircraft exists
        const aircraft = await this.prisma.aircraft.findUnique({
            where: { id: data.aircraftId },
        });
        if (!aircraft) {
            throw new RecordNotFoundError(`Aircraft with id '${data.aircraftId}' not found`);
        }

        // 1.0 Check Airworthiness
        if (aircraft.status !== 'READY') {
            throw new BadRequestError(`Aircraft is not airworthy (Status: ${aircraft.status})`);
        }

        // 1.1 Check if instructor exists and has the correct role
        if (data.instructorId) {
            const instructor = await this.prisma.user.findUnique({
                where: { id: data.instructorId },
                select: { id: true, role: true }
            });

            if (!instructor) {
                throw new BadRequestError("Invalid Instructor ID");
            }

            if (instructor.role !== 'INSTRUCTOR') {
                throw new BadRequestError("User is not an Instructor");
            }
        }

        // 2. Check for conflicts (Overlap detection)
        // A conflict exists if (StartA < EndB) AND (EndA > StartB)

        // Check Aircraft Conflict
        const aircraftConflict = await this.prisma.flightSession.findFirst({
            where: {
                aircraftId: data.aircraftId,
                status: { in: [FlightStatus.SCHEDULED, FlightStatus.IN_PROGRESS] },
                AND: [
                    { scheduledDeparture: { lt: data.scheduledArrival } },
                    { scheduledArrival: { gt: data.scheduledDeparture } },
                ],
            },
        });

        if (aircraftConflict) {
            throw new ConflictError("Aircraft is already booked for the selected time.");
        }

        // Check Pilot/Instructor Conflict
        const personnelConflict = await this.prisma.flightSession.findFirst({
            where: {
                OR: [
                    { pilotId: data.pilotId },
                    { instructorId: data.pilotId },
                    ...(data.instructorId ? [
                        { pilotId: data.instructorId },
                        { instructorId: data.instructorId }
                    ] : [])
                ],
                status: { in: [FlightStatus.SCHEDULED, FlightStatus.IN_PROGRESS] },
                AND: [
                    { scheduledDeparture: { lt: data.scheduledArrival } },
                    { scheduledArrival: { gt: data.scheduledDeparture } },
                ],
            },
        });

        if (personnelConflict) {
            throw new ConflictError("Pilot or instructor is already booked for the selected time.");
        }

        // 3. Create Flight
        return this.prisma.flightSession.create({
            data: {
                flightNumber: data.flightNumber,
                aircraftId: data.aircraftId,
                pilotId: data.pilotId,
                instructorId: data.instructorId ?? null,
                scheduledDeparture: data.scheduledDeparture,
                scheduledArrival: data.scheduledArrival,
                status: FlightStatus.SCHEDULED,
            },
            include: {
                aircraft: true,
                pilot: {
                    select: { id: true, fullName: true, email: true }
                },
                instructor: {
                    select: { id: true, fullName: true, email: true }
                }
            }
        });
    }

    async getPilotFlights(pilotId: string) {
        return this.prisma.flightSession.findMany({
            where: {
                OR: [
                    { pilotId },
                    { instructorId: pilotId }
                ]
            },
            include: {
                aircraft: true,
                instructor: {
                    select: { id: true, fullName: true }
                }
            },
            orderBy: {
                scheduledDeparture: 'desc'
            }
        });
    }
}
