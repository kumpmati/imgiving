import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db';
import { wishQuestionTable, wishTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';

export const load = async ({ params, parent }) => {
	const { wish, isOwner } = await parent();

	if (isOwner) {
		// marks questions up to this point as seen
		await db
			.update(wishTable)
			.set({ lastSeenQuestionTimestamp: new Date() })
			.where(eq(wishTable.id, wish.id));
	}

	return {
		streamed: {
			questions: db.query.wishQuestionTable.findMany({
				where: eq(wishQuestionTable.wishId, params.wishId),
				orderBy: asc(wishQuestionTable.createdAt) // newest last so that messages are rendered in correct order
			})
		}
	};
};

export const actions = {
	send_question: async ({ locals, request, params }) => {
		if (!locals.user) error(403, 'unauthorized');

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db.insert(wishQuestionTable).values({
			id: chatMessageId(),
			message: raw.message.toString(),
			wishId: params.wishId,
			userId: locals.user.id
		});
	}
};
