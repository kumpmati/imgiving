import { getListMember } from '#lib/server/db/handlers/listUser.ts';
import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import z from 'zod';
import { db } from '../server/db';
import {
	wishCommentInsertSchema,
	wishCommentTable,
	wishQuestionInsertSchema,
	wishQuestionTable,
	wishTable
} from '../server/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { chatMessageId } from '#lib/id.ts';
import {
	deleteByTokens,
	getWishAuthorNotifications
} from '#lib/server/db/handlers/notifications.ts';
import { fcm } from '#lib/server/fcm/index.ts';
import { markQuestionsAsSeen as markQuestionsAsSeenHandler } from '#lib/server/db/handlers/questions.ts';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const getComments = query(schema, async (body) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		error(401);
	}

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
});

export const getQuestions = query(schema, async (body) => {
	const e = getRequestEvent();
	const locals = e.locals;

	if (!locals.user) {
		error(401);
	}

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
});

export const sendQuestion = command(
	schema.and(wishQuestionInsertSchema.omit({ id: true })),
	async (body) => {
		const { locals } = getRequestEvent();

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
		await markQuestionsAsSeenHandler(body.wishId, body.listId, locals.user.id);

		return rows[0];
	}
);

export const sendComment = command(
	schema.and(wishCommentInsertSchema.omit({ id: true })),
	async (body) => {
		const { locals } = getRequestEvent();

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
);

export const markQuestionsAsSeen = command(schema, async (body) => {
	const { locals } = getRequestEvent();

	if (!locals.user) error(401);
	if (!(await getListMember(body.listId, locals.user.id))) error(403);

	await markQuestionsAsSeenHandler(body.wishId, body.listId, locals.user.id);
});
