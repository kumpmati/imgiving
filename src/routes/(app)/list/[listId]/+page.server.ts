import { redirectToSignIn } from '$lib/return.js';
import { getListMember } from '$lib/server/db/handlers/listUser.js';
import { createWish, getOwnWishes } from '$lib/server/db/handlers/wish.js';
import { db } from '$lib/server/db/index.js';
import { wishInsertSchema, wishSchema, wishTable } from '$lib/server/db/schema/wish.js';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ locals, params, url }) => {
	if (!locals.user) return redirectToSignIn(url);

	const wishes = await getOwnWishes(params.listId, locals.user.id);

	return {
		wishes
	};
};

export const actions = {
	add_wish: async ({ params, locals, request }) => {
		if (!locals.user) error(401);
		if (!(await getListMember(params.listId, locals.user.id))) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = wishInsertSchema
			.pick({ name: true, price: true, description: true })
			.safeParse(raw);

		if (!parsed.success) {
			error(400, 'invalid wish');
		}

		await createWish({
			listId: params.listId,
			userId: locals.user.id,
			...parsed.data
		});
	},

	delete_wish: async ({ params, locals, request }) => {
		if (!locals.user) error(401);
		if (!(await getListMember(params.listId, locals.user.id))) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = wishSchema.pick({ id: true }).safeParse(raw);
		if (!parsed.success) {
			error(400, 'invalid delete request');
		}

		await db
			.delete(wishTable)
			.where(and(eq(wishTable.userId, locals.user.id), eq(wishTable.id, parsed.data.id)));
	}
};
