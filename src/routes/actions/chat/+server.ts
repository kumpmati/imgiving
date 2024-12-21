import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db';
import { getListMember } from '$lib/server/db/handlers/listUser';
import { markQuestionsAsSeen } from '$lib/server/db/handlers/questions';
import {
	wishCommentTable,
	wishQuestionTable,
	wishTable,
	wishQuestionInsertSchema,
	wishCommentInsertSchema
} from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const POST = endpoint({
	getQuestions: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		const wish = await db.query.wishTable.findFirst({
			where: and(eq(wishTable.id, body.wishId), eq(wishTable.listId, body.listId)),
			with: {
				user: { columns: { name: true } }
			}
		});

		if (!wish) {
			error(404, 'wish not found');
		}

		// TODO: make sure the given listId matches the wish's list
		const questions = await db
			.select()
			.from(wishQuestionTable)
			.where(eq(wishQuestionTable.wishId, body.wishId))
			.orderBy(asc(wishQuestionTable.createdAt));

		return {
			wish,
			questions
		};
	}),

	getComments: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		const wish = await db.query.wishTable.findFirst({
			where: and(eq(wishTable.id, body.wishId), eq(wishTable.listId, body.listId)),
			with: {
				user: { columns: { name: true } }
			}
		});

		if (!wish) {
			error(404, 'wish not found');
		}

		// TODO: make sure the given listId matches the wish's list
		const comments = await db
			.select()
			.from(wishCommentTable)
			.where(eq(wishCommentTable.wishId, body.wishId))
			.orderBy(asc(wishCommentTable.createdAt));

		return {
			wish,
			comments
		};
	}),

	sendQuestion: zod(
		schema.and(wishQuestionInsertSchema.omit({ id: true })),
		async ({ locals }, body) => {
			if (!locals.user) error(401);
			if (!(await getListMember(body.listId, locals.user.id))) error(403);

			const [inserted] = await db
				.insert(wishQuestionTable)
				.values({
					id: chatMessageId(),
					wishId: body.wishId,
					message: body.message,
					userId: locals.user.id
				})
				.returning();

			// this will mark questions as seen if the user is the owner of the wish
			await markQuestionsAsSeen(body.wishId, body.listId, locals.user.id);

			return inserted;
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
