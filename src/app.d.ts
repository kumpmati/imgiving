// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from '$lib/server/db/schema/user';
import 'unplugin-icons/types/svelte';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | null;
		}

		// interface Platform {}
	}
}

export {};
