import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "prisma/.env") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "ts-node prisma/seed.ts",
  },
});