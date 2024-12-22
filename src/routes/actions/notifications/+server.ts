import { db } from '$lib/server/db';
import { userNotificationsTable } from '$lib/server/db/schema/userNotifications';
import { error } from '@sveltejs/kit';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

export const POST = endpoint({
	saveToken: zod(z.string(), async ({ locals }, token) => {
		if (!locals.user) error(403); // TODO: better error handling

		// TODO: update notification settings when implemented
		const [inserted] = await db
			.insert(userNotificationsTable)
			.values({ userId: locals.user.id, token })
			.returning()
			.onConflictDoNothing();

		return inserted;
	})
});

export type NotificationEndpoint = typeof POST;
