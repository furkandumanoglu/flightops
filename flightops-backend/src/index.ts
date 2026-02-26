import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { AircraftService } from "./services/aircraft.service";
import { createAircraftRoutes } from "./routes/aircraft.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config({ path: path.join(__dirname, "..", "prisma/.env") });

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const aircraftService = new AircraftService(prisma);

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("FlightOps API Works Correctly! ✈️");
});

app.get("/api/flights", async (req: Request, res: Response) => {
  try {
    const flights = await (prisma as unknown as { flightSession: { findMany: () => Promise<unknown[]> } }).flightSession.findMany();
    res.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/aircraft", createAircraftRoutes(aircraftService));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

