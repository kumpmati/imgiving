import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db/index.js';
import { wishCommentTable, wishQuestionTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const actions = {
	send_question: async ({ request, locals }) => {
		if (!locals.user) error(403);

		// TODO: validation
		const { id, message } = Object.fromEntries(await request.formData());

		await db.insert(wishQuestionTable).values({
			id: chatMessageId(),
			wishId: id.toString(),
			message: message.toString(),
			userId: locals.user.id
		});
	},

	send_comment: async ({ request, locals }) => {
		if (!locals.user) error(403);

		// TODO: validation
		const { id, message } = Object.fromEntries(await request.formData());

		await db.insert(wishCommentTable).values({
			id: chatMessageId(),
			wishId: id.toString(),
			message: message.toString(),
			userId: locals.user.id
		});
	}
};
