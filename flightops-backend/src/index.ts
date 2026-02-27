import { createAuthRoutes } from "./routes/auth.routes";
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
import { WeightBalanceService } from "./services/wb.service";
import { AuthService } from "./services/auth.service";
import { createAircraftRoutes } from "./routes/aircraft.routes";
import { FlightService } from "./services/flight.service";
import { createFlightRoutes } from "./routes/flight.routes";
import { errorHandler } from "./middleware/error.middleware";



dotenv.config({ path: path.join(__dirname, "..", "prisma/.env") });

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const authService = new AuthService(prisma);
const aircraftService = new AircraftService(prisma);
const wbService = new WeightBalanceService(aircraftService);
const flightService = new FlightService(prisma);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use('/api/auth', createAuthRoutes(authService));

app.get("/", (req: Request, res: Response) => {
  res.send("FlightOps API Works Correctly! ✈️");
});

app.use("/api/aircraft", createAircraftRoutes(aircraftService, wbService));
app.use("/api/flights", createFlightRoutes(flightService));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Keep process alive
setInterval(() => { }, 1000 * 60 * 60);

