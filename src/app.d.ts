// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from '#lib/server/db/schema/index.ts';
import type { User } from '#lib/server/db/schema/user.ts';
import 'unplugin-icons/types/svelte';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}

export {};
