import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

console.log("Loggin here ", process.env.DATABASE_URL);
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const dbClient = new PrismaClient({ adapter });

export * from "../generated/prisma/client.js";
