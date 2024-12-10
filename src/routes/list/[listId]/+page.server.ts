import { joinList, leaveList } from '$lib/server/db/handlers/listUser.js';
import { createWish, getOwnWishes } from '$lib/server/db/handlers/wish.js';
import { db } from '$lib/server/db/index.js';
import { wishTable } from '$lib/server/db/schema/wish.js';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(403, 'unauthorized'); // TODO: handle auth redirect?

	const wishes = await getOwnWishes(params.listId, locals.user.id);

	return {
		wishes
	};
};

export const actions = {
	join_list: async ({ locals, params }) => {
		if (!locals.user) error(403); // TODO: handle auth redirect

		await joinList(params.listId, locals.user.id);
	},

	leave_list: async ({ locals, params }) => {
		if (!locals.user) error(403); // TODO: handle auth redirect

		await leaveList(params.listId, locals.user.id);

		redirect(302, '/');
	},

	add_wish: async ({ params, locals, request }) => {
		if (!locals.user) return error(403);

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await createWish({
			listId: params.listId,
			userId: locals.user.id,
			name: raw.name.toString(),
			price: raw.price?.toString?.() ?? null,
			description: raw.description?.toString?.() ?? null
		});
	},

	edit_wish_price: async ({ locals, request }) => {
		if (!locals.user) error(403);

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		const [updated] = await db
			.update(wishTable)
			.set({ price: raw.value.toString() })
			.where(and(eq(wishTable.userId, locals.user.id), eq(wishTable.id, raw.wishId.toString())))
			.returning();

		return updated;
	},

	delete_wish: async ({ locals, request }) => {
		if (!locals.user) error(403);

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db
			.delete(wishTable)
			.where(and(eq(wishTable.userId, locals.user.id), eq(wishTable.id, raw.id.toString())));
	}
};
