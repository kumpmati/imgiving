import { redirectToSignIn } from '#lib/return.js';
import { getListMember } from '#lib/server/db/handlers/listUser.js';
import { createWish, getOwnWishes, updateWish } from '#lib/server/db/handlers/wish.js';
import { db } from '#lib/server/db/index.js';
import { wishSchema, wishTable } from '#lib/server/db/schema/wish.js';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

export const load = async ({ locals, params, url }) => {
	if (!locals.user) return redirectToSignIn(url);

	return { wishes: await getOwnWishes(params.listId, locals.user.id) };
};

const addWishSchema = z.object({
	name: z.string().max(100),
	description: z.string().max(500).optional(),
	imageUrl: z.string().optional(),
	price: z
		.string()
		.optional()
		.refine((val) => (val ? !isNaN(parseFloat(val)) : true))
});

export const actions = {
	add_wish: async ({ params, locals, request }) => {
		if (!locals.user) error(401);
		if (!(await getListMember(params.listId, locals.user.id))) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = addWishSchema.safeParse(raw);

		if (!parsed.success) {
			console.log(parsed.error);
			error(400, 'invalid wish');
		}

		await createWish({
			listId: params.listId,
			userId: locals.user.id,
			name: parsed.data.name,
			description: parsed.data.description,
			imageUrl: parsed.data.imageUrl,
			priceCents: parsed.data.price ? Math.round(parseFloat(parsed.data.price) * 100) : undefined
		});
	},

	update_wish: async ({ params, locals, request }) => {
		if (!locals.user) error(401);
		if (!(await getListMember(params.listId, locals.user.id))) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = addWishSchema.and(z.object({ wishId: z.string() })).safeParse(raw);

		if (!parsed.success) {
			console.log(parsed.error);
			error(400, 'invalid wish');
		}

		await updateWish(parsed.data.wishId, {
			name: parsed.data.name,
			description: parsed.data.description,
			imageUrl: parsed.data.imageUrl,
			priceCents: parsed.data.price ? Math.round(parseFloat(parsed.data.price) * 100) : undefined
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
