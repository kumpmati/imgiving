import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db/index.js';
import {
	wishCommentInsertSchema,
	wishCommentTable,
	wishQuestionInsertSchema,
	wishQuestionTable
} from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const actions = {
	send_question: async ({ request, locals }) => {
		if (!locals.user) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = wishQuestionInsertSchema.pick({ id: true, message: true }).safeParse(raw);
		if (!parsed.success) {
			error(400, 'invalid question');
		}

		await db.insert(wishQuestionTable).values({
			id: chatMessageId(),
			wishId: parsed.data.id,
			message: parsed.data.message,
			userId: locals.user.id
		});
	},

	send_comment: async ({ request, locals }) => {
		if (!locals.user) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = wishCommentInsertSchema.pick({ id: true, message: true }).safeParse(raw);
		if (!parsed.success) {
			error(400, 'invalid comment');
		}

		await db.insert(wishCommentTable).values({
			id: chatMessageId(),
			wishId: parsed.data.id,
			message: parsed.data.message,
			userId: locals.user.id
		});
	}
};
