import { db } from '$lib/server/db/index.js';
import { listTable } from '$lib/server/db/schema/list.js';
import { wishTable } from '$lib/server/db/schema/wish.js';
import { wishQuestionTable } from '$lib/server/db/schema/wishComments.js';
import { error } from '@sveltejs/kit';
import { and, count, eq, getTableColumns, gte, not } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	if (!locals.user) error(403, 'not signed in'); // TODO: handle auth redirect

	const [list, ownWishes] = await Promise.all([
		db.query.listTable.findFirst({
			where: eq(listTable.id, params.id),
			with: {
				users: {
					columns: { userId: true, joinedAt: true },
					with: { user: { columns: { name: true } } }
				}
			}
		}),

		db
			.select({ ...getTableColumns(wishTable), numUnreadQuestions: count(wishQuestionTable) })
			.from(wishTable)
			.where(and(eq(wishTable.listId, params.id), eq(wishTable.userId, locals.user.id)))
			.leftJoin(
				wishQuestionTable,
				and(
					eq(wishTable.id, wishQuestionTable.wishId),
					// filter only questions that haven't been seen by the author
					gte(wishQuestionTable.createdAt, wishTable.lastSeenQuestionTimestamp)
				)
			)
			.groupBy(wishTable.id)
	]);

	if (!list) {
		error(404, 'list not found');
	}

	return {
		list,
		ownWishes,

		streamed: {
			allWishes: db.query.wishTable.findMany({
				where: and(
					eq(wishTable.listId, params.id),
					// exclude own wishes
					not(eq(wishTable.userId, locals.user.id))
				),
				with: { user: { columns: { name: true } } }
			})
		}
	};
};
