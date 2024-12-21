import { db } from '$lib/server/db';
import { getListMember, leaveList } from '$lib/server/db/handlers/listUser';
import { wishCommentTable, wishQuestionTable } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const POST = endpoint({
	leaveList: zod(z.string(), async ({ locals }, listId) => {
		if (!locals.user) error(401);
		await leaveList(listId, locals.user.id);
		redirect(302, '/');
	}),

	getWishQuestions: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		// TODO: make sure the given listId matches the wish's list
		return await db
			.select()
			.from(wishQuestionTable)
			.where(eq(wishQuestionTable.wishId, body.wishId))
			.orderBy(asc(wishQuestionTable.createdAt));
	}),

	getWishComments: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401);
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		// TODO: make sure the given listId matches the wish's list
		return await db
			.select()
			.from(wishCommentTable)
			.where(eq(wishCommentTable.wishId, body.wishId))
			.orderBy(asc(wishCommentTable.createdAt));
	})
});

export type ListEndpoint = typeof POST;
