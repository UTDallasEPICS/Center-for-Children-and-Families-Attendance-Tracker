import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../app/generated/prisma';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({ adapter });

export { prisma };