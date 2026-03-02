"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config({ path: node_path_1.default.join(__dirname, "..", "prisma/.env") });
async function testConnection() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    try {
        console.log("Attempting to connect to database...");
        await prisma.$connect();
        console.log("Connected successfully!");
        const userCount = await prisma.user.count();
        console.log("User count in database:", userCount);
        const users = await prisma.user.findMany({ take: 5 });
        console.log("Recent users:", users);
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
testConnection();
//# sourceMappingURL=test-db.js.map