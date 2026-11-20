import { db } from '#lib/server/db/index.ts';
import { getListMember, leaveList as leaveListHandler } from '#lib/server/db/handlers/listUser.ts';
import { wishCommentTable, wishQuestionTable } from '#lib/server/db/schema/index.ts';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { z } from 'zod';
import { command, getRequestEvent, query } from '$app/server';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const leaveList = command(z.string(), async (listId) => {
	const { locals } = getRequestEvent();

	if (!locals.user) error(401);
	await leaveListHandler(listId, locals.user.id);
	redirect(302, '/');
});

export const getWishQuestions = query(schema, async (body) => {
	const { locals } = getRequestEvent();

	if (!locals.user) error(401);
	if (!(await getListMember(body.listId, locals.user.id))) error(403);

	// TODO: make sure the given listId matches the wish's list
	return await db
		.select()
		.from(wishQuestionTable)
		.where(eq(wishQuestionTable.wishId, body.wishId))
		.orderBy(asc(wishQuestionTable.createdAt));
});

export const getWishComments = query(schema, async (body) => {
	const { locals } = getRequestEvent();

	if (!locals.user) error(401);
	if (!(await getListMember(body.listId, locals.user.id))) error(403);

	// TODO: make sure the given listId matches the wish's list
	return await db
		.select()
		.from(wishCommentTable)
		.where(eq(wishCommentTable.wishId, body.wishId))
		.orderBy(asc(wishCommentTable.createdAt));
});
