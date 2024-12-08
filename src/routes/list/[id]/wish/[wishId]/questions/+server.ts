import { db } from '$lib/server/db';
import { wishTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { endpoint } from 'sveltekit-superactions';

export const POST = endpoint({
	markAsRead: async ({ params, locals }) => {
		if (!locals.user) error(403, 'unauthorized');

		// marks questions up to this point as seen
		await db
			.update(wishTable)
			.set({ lastSeenQuestionTimestamp: new Date() })
			.where(
				and(
					eq(wishTable.id, params.wishId!),
					// make sure only the owner can do this
					eq(wishTable.userId, locals.user.id)
				)
			);
	}
});

export type QuestionEndpoint = typeof POST;
