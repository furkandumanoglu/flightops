import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log(`Seeding database...`);

    // 1. Seed Admin User
    const email = "admin@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: hashedPassword,
            fullName: "System Admin",
            role: "ADMIN",
        },
    });

    console.log(`Seeded user: ${user.email}`);
    console.log(`ADMIN_UUID=${user.id}`);

    // 1.1 Seed Instructor User
    const instructorEmail = "instructor@flightops.com";
    const instructorPassword = "password123";
    const instructorHashedPassword = await bcrypt.hash(instructorPassword, 10);

    // Delete existing to ensure the ID is updated if it already exists
    await prisma.user.deleteMany({ where: { email: instructorEmail } });

    const instructor = await prisma.user.create({
        data: {
            id: "7c9e6679-7425-40de-944b-617a22676767",
            email: instructorEmail,
            passwordHash: instructorHashedPassword,
            fullName: "Captain Jack Sparrow",
            role: "INSTRUCTOR",
        },
    });

    console.log(`Seeded instructor: ${instructor.email}`);
    console.log(`INSTRUCTOR_UUID=${instructor.id}`);

    // 2. Seed Aircraft
    // TC-FRO (Cessna 172) -> Status: READY
    const aircraft1 = await prisma.aircraft.upsert({
        where: { tailNumber: "TC-FRO" },
        update: {
            model: "Cessna 172",
            status: "READY",
            nextMaintenanceHours: 50,
        },
        create: {
            tailNumber: "TC-FRO",
            model: "Cessna 172",
            emptyWeight: 1600,
            emptyWeightArm: 40.0,
            maxTakeOffWeight: 2400,
            fuelCapacity: 56,
            status: "READY",
            nextMaintenanceHours: 50,
        },
    });

    // TC-EVN (Diamond DA42) -> Status: MAINTENANCE
    const aircraft2 = await prisma.aircraft.upsert({
        where: { tailNumber: "TC-EVN" },
        update: {
            status: "MAINTENANCE",
            nextMaintenanceHours: 0,
        },
        create: {
            tailNumber: "TC-EVN",
            model: "Diamond DA42",
            emptyWeight: 2800,
            emptyWeightArm: 95.0,
            maxTakeOffWeight: 4400,
            fuelCapacity: 76,
            status: "MAINTENANCE",
            nextMaintenanceHours: 0,
        },
    });

    // TC-GMN (Cessna 152) -> Status: GROUNDED
    const aircraft3 = await prisma.aircraft.upsert({
        where: { tailNumber: "TC-GMN" },
        update: {
            status: "GROUNDED",
            nextMaintenanceHours: 15,
        },
        create: {
            tailNumber: "TC-GMN",
            model: "Cessna 152",
            emptyWeight: 1100,
            emptyWeightArm: 35.0,
            maxTakeOffWeight: 1670,
            fuelCapacity: 26,
            status: "GROUNDED",
            nextMaintenanceHours: 15,
        },
    });

    console.log(`Seeded aircraft: TC-FRO, TC-EVN, TC-GMN`);

    // 3. Seed Stations for Cessna 172
    const stations = [
        { name: "Front Seats", arm: 37.0 },
        { name: "Fuel Tank", arm: 46.0 },
    ];

    for (const station of stations) {
        await prisma.aircraftStation.upsert({
            where: {
                // We don't have a unique constraint on name + aircraftId in schema, 
                // but for seeding we can just find or create.
                id: `seed-station-${station.name.replace(/\s+/g, '-').toLowerCase()}-${aircraft1.tailNumber.toLowerCase()}`
            },
            update: {
                name: station.name,
                arm: station.arm,
                aircraftId: aircraft1.id
            },
            create: {
                id: `seed-station-${station.name.replace(/\s+/g, '-').toLowerCase()}-${aircraft1.tailNumber.toLowerCase()}`,
                name: station.name,
                arm: station.arm,
                aircraftId: aircraft1.id,
            },
        });
        console.log(`Seeded station: ${station.name} for ${aircraft1.tailNumber}`);
    }

    console.log(`\nIMPORTANT: Take note of the UUIDs for integration:`);
    console.log(`AIRCRAFT_FRO_UUID=${aircraft1.id}`);
    console.log(`AIRCRAFT_EVN_UUID=${aircraft2.id}`);
    console.log(`AIRCRAFT_GMN_UUID=${aircraft3.id}`);
    console.log(`INSTRUCTOR_UUID=${instructor.id}`);
    console.log(`ADMIN_UUID=${user.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
