import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const g = globalThis as unknown as { prisma?: PrismaClient };

// Created lazily so `next build` works without a database.
export function db(): PrismaClient {
  if (!g.prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    g.prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  }
  return g.prisma;
}
