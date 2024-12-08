import { db } from '$lib/server/db';
import { wishQuestionTable, wishTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, count, eq, gte } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const wish = await db.query.wishTable.findFirst({
		where: and(eq(wishTable.id, params.wishId), eq(wishTable.listId, params.id)),
		with: { user: true }
	});

	if (!wish) {
		error(404, 'wish not found');
	}

	const [unread] = await db
		.select({ numUnread: count(wishQuestionTable) })
		.from(wishQuestionTable)
		.where(
			and(
				eq(wishQuestionTable.wishId, params.wishId),
				gte(wishQuestionTable.createdAt, wish.lastSeenQuestionTimestamp)
			)
		)
		.groupBy(wishQuestionTable.wishId);

	return {
		wish,
		isOwner: locals.user?.id === wish.userId,
		numUnreadQuestions: unread?.numUnread ?? 0
	};
};
