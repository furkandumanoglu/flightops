import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "..", "prisma/.env") });

async function testConnection() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Attempting to connect to database...");
        await prisma.$connect();
        console.log("Connected successfully!");

        const userCount = await prisma.user.count();
        console.log("User count in database:", userCount);

        const users = await prisma.user.findMany({ take: 5 });
        console.log("Recent users:", users);

    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

testConnection();
