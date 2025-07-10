import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const prismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["error"],
	});
export default prismaClient;

if (process.env.NODE_ENV !== "production")
	globalForPrisma.prisma = prismaClient;
