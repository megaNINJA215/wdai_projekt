import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error("Brak zmiennej POSTGRES_PRISMA_URL");
}

const caBase64 = process.env.SUPABASE_CA_CERT_BASE64;

if (!caBase64) {
  throw new Error("Brak zmiennej SUPABASE_CA_CERT_BASE64");
}

const ca = Buffer.from(caBase64, "base64").toString("utf8");

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    ca,
    rejectUnauthorized: true,
  },
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;