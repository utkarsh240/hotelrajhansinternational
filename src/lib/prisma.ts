import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function setupDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

function getOrCreatePrismaClient(): PrismaClient | null {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  try {
    setupDatabaseUrl();
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch (err) {
    console.error("Failed to initialize PrismaClient:", err);
    return null;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getOrCreatePrismaClient();
    if (!client) {
      return undefined;
    }
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});
