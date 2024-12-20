import { redirectToSignIn } from '$lib/return.js';
import { db } from '$lib/server/db/index.js';
import { listTable } from '$lib/server/db/schema/list.js';
import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const load = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth/signin?back=/account');

	return {
		wishlists: await db.query.listTable.findMany({
			where: eq(listTable.authorId, locals.user.id),
			orderBy: desc(listTable.createdAt),
			with: {
				users: { columns: { userId: true } }
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
