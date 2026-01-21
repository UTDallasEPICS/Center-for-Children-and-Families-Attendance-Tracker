import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '~/generated/prisma/client';

const config = useRuntimeConfig()

const adapter = new PrismaBetterSqlite3({
  url: config.public.dbURL,
});

export const prisma = new PrismaClient({ adapter });
