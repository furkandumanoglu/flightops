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

    // 2. Seed Cessna 172 Aircraft
    const aircraft = await prisma.aircraft.upsert({
        where: { tailNumber: "TC-FRO" },
        update: {
            model: "Cessna 172",
            emptyWeight: 1600,
            emptyWeightArm: 40.0,
            maxTakeOffWeight: 2400,
            fuelCapacity: 56,
        },
        create: {
            tailNumber: "TC-FRO",
            model: "Cessna 172",
            emptyWeight: 1600,
            emptyWeightArm: 40.0,
            maxTakeOffWeight: 2400,
            fuelCapacity: 56,
        },
    });

    console.log(`Seeded aircraft: ${aircraft.tailNumber} (${aircraft.id})`);

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
                id: `seed-station-${station.name.replace(/\s+/g, '-').toLowerCase()}-${aircraft.tailNumber.toLowerCase()}`
            },
            update: {
                name: station.name,
                arm: station.arm,
                aircraftId: aircraft.id
            },
            create: {
                id: `seed-station-${station.name.replace(/\s+/g, '-').toLowerCase()}-${aircraft.tailNumber.toLowerCase()}`,
                name: station.name,
                arm: station.arm,
                aircraftId: aircraft.id,
            },
        });
        console.log(`Seeded station: ${station.name} for ${aircraft.tailNumber}`);
    }

    console.log(`\nIMPORTANT: Take note of the Aircraft UUID for integration:`);
    console.log(`AIRCRAFT_UUID=${aircraft.id}`);
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
