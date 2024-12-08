// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/server/db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			db: DrizzleD1Database;
			user: User | null;
		}

		interface Platform {
			env: {
				DB: D1Database;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
