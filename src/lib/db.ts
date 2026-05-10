import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const DEFAULT_USER_ID = "user_default"

/**
 * Ensures the default user exists in the database.
 * Called before any DB write that references userId = "user_default".
 */
export async function ensureDefaultUser() {
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      email: "default@affiliateiq.local",
      name: "User",
    },
  })
}
