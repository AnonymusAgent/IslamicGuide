import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });

export * from './schema';
