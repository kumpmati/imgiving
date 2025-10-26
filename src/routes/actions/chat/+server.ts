import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db';
import { getListMember } from '$lib/server/db/handlers/listUser';
import { deleteByTokens, getWishAuthorNotifications } from '$lib/server/db/handlers/notifications';
import { markQuestionsAsSeen } from '$lib/server/db/handlers/questions';
import {
	wishCommentTable,
	wishQuestionTable,
	wishTable,
	wishQuestionInsertSchema,
	wishCommentInsertSchema
} from '$lib/server/db/schema';
import { fcm } from '$lib/server/fcm';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const schema = z.object({ listId: z.string(), wishId: z.string() });

export const POST = endpoint({
	getQuestions: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		const wish = await db.query.wishTable.findFirst({
			where: and(eq(wishTable.id, body.wishId), eq(wishTable.listId, body.listId)),
			with: { user: { columns: { name: true } } }
		});

		if (!wish) {
			error(404, 'wish not found');
		}

		// TODO: make sure the given listId matches the wish's list
		const questions = await db.query.wishQuestionTable.findMany({
			where: eq(wishQuestionTable.wishId, body.wishId),
			orderBy: asc(wishQuestionTable.createdAt),
			with: { user: { columns: { name: true } } }
		});

		return { wish, questions };
	}),

	getComments: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		const wish = await db.query.wishTable.findFirst({
			where: and(eq(wishTable.id, body.wishId), eq(wishTable.listId, body.listId)),
			with: { user: { columns: { name: true } } }
		});

		if (!wish) {
			error(404, 'wish not found');
		}

		// TODO: make sure the given listId matches the wish's list
		const comments = await db.query.wishCommentTable.findMany({
			where: eq(wishCommentTable.wishId, body.wishId),
			orderBy: asc(wishCommentTable.createdAt),
			with: { user: { columns: { name: true } } }
		});

		return { wish, comments };
	}),

	sendQuestion: zod(
		schema.and(wishQuestionInsertSchema.omit({ id: true })),
		async ({ locals }, body) => {
			if (!locals.user) error(401);
			if (!(await getListMember(body.listId, locals.user.id))) error(403);

			const [rows, notifications] = await Promise.all([
				db
					.insert(wishQuestionTable)
					.values({
						id: chatMessageId(),
						listId: body.listId,
						wishId: body.wishId,
						message: body.message,
						userId: locals.user.id
					})
					.returning(),
				getWishAuthorNotifications(body.wishId)
			]);

			// TODO: clean up notification logic
			// don't send notification if wish owner is sending question
			if (notifications.length > 0 && notifications[0].wishUserId !== locals.user.id) {
				const unregistered = await fcm.sendToTokens(
					{
						notification: {
							title: 'New question',
							body: `Someone asked a question about '${notifications[0].wishName}'`
						},

						webpush: {
							notification: {
								title: 'New question',
								body: `Someone asked a question about '${notifications[0].wishName}'`,
								actions: [{ action: 'open', title: 'View message' }]
							}
						}
					},
					notifications.map((n) => n.token)
				);

				if (unregistered.length > 0) {
					await deleteByTokens(unregistered);
				}
			}

			// this will mark questions as seen if the user is the owner of the wish
			await markQuestionsAsSeen(body.wishId, body.listId, locals.user.id);

			return rows[0];
		}
	),

	sendComment: zod(
		schema.and(wishCommentInsertSchema.omit({ id: true })),
		async ({ locals }, body) => {
			if (!locals.user) error(401);
			if (!(await getListMember(body.listId, locals.user.id))) error(403);

			const [inserted] = await db
				.insert(wishCommentTable)
				.values({
					id: chatMessageId(),
					listId: body.listId,
					wishId: body.wishId,
					message: body.message,
					userId: locals.user.id
				})
				.returning();

			return inserted;
		}
	),

	markQuestionsAsSeen: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		await markQuestionsAsSeen(body.wishId, body.listId, locals.user.id);
	})
});

export type ChatEndpoint = typeof POST;
