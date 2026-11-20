import { redirectToSignIn } from '#lib/return.js';
import { db } from '#lib/server/db/index.js';
import { listTable } from '#lib/server/db/schema/list.js';
import { listUserTable } from '#lib/server/db/schema/listUser.js';
import { fail } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const load = async ({ locals, url }) => {
	if (!locals.user) return redirectToSignIn(url);

	return {
		memberships: await db.query.listUserTable.findMany({
			where: eq(listUserTable.userId, locals.user.id),
			orderBy: desc(listUserTable.joinedAt),
			columns: { listId: true, joinedAt: true },
			with: {
				list: {
					columns: { name: true, authorId: true, createdAt: true },
					with: { users: { columns: { userId: true } } }
				}
			}
		})
	};
};

export const actions = {
	delete_list: async ({ locals, request, url }) => {
		if (!locals.user) return redirectToSignIn(url);

		const raw = Object.fromEntries(await request.formData());
		const parsed = z.object({ id: z.string() }).safeParse(raw);
		if (!parsed.success) {
			return fail(400, { message: 'invalid list ID provided' });
		}

		await db
			.delete(listTable)
			.where(and(eq(listTable.authorId, locals.user.id), eq(listTable.id, parsed.data.id)));
	}
};
