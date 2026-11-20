import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$app/env/private';
import * as schema from './schema';

const client = neon(DATABASE_URL);
export const db = drizzle(client, { schema });
