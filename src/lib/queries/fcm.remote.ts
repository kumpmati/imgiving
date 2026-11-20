import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import z from 'zod';
import { db } from '../server/db';
import { userNotificationsTable } from '../server/db/schema';

export const saveToken = command(z.string(), async (token) => {
	const e = getRequestEvent();
	const user = e.locals.user;

	if (!user) {
		error(403); // TODO: better error handling
	}

	// TODO: update notification settings when implemented
	const [inserted] = await db
		.insert(userNotificationsTable)
		.values({ userId: user.id, token })
		.returning()
		.onConflictDoNothing();

	return inserted;
});
