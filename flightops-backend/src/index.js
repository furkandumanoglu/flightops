"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = require("./routes/auth.routes");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const aircraft_service_1 = require("./services/aircraft.service");
const wb_service_1 = require("./services/wb.service");
const auth_service_1 = require("./services/auth.service");
const aircraft_routes_1 = require("./routes/aircraft.routes");
const flight_service_1 = require("./services/flight.service");
const flight_routes_1 = require("./routes/flight.routes");
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config({ path: node_path_1.default.join(__dirname, "..", "prisma/.env") });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const authService = new auth_service_1.AuthService(prisma);
const aircraftService = new aircraft_service_1.AircraftService(prisma);
const wbService = new wb_service_1.WeightBalanceService(aircraftService);
const flightService = new flight_service_1.FlightService(prisma);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use('/api/auth', (0, auth_routes_1.createAuthRoutes)(authService));
app.get("/", (req, res) => {
    res.send("FlightOps API Works Correctly! ✈️");
});
app.use("/api/aircraft", (0, aircraft_routes_1.createAircraftRoutes)(aircraftService, wbService));
app.use("/api/flights", (0, flight_routes_1.createFlightRoutes)(flightService));
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Keep process alive
setInterval(() => { }, 1000 * 60 * 60);
//# sourceMappingURL=index.js.map