import { getListMember, joinList } from '$lib/server/db/handlers/listUser.js';
import { createWish, getAllWishesWithCounts, getBuylist } from '$lib/server/db/handlers/wish.js';
import { db } from '$lib/server/db/index.js';
import { wishStatusTable } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	if (!locals.user) error(403, 'unauthorized'); // TODO: handle auth redirect

	return {
		streamed: {
			allWishes: getAllWishesWithCounts(params.id, locals.user.id),
			// TODO: re-enable streaming? (messes up some animations)
			buylist: await getBuylist(params.id, locals.user.id)
		}
	};
};

export const actions = {
	join: async ({ locals, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		const existing = await getListMember(params.id, locals.user.id);
		if (existing) {
			return; // do nothing
		}

		await joinList(params.id, locals.user.id);
	},

	add_wish: async ({ locals, request, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await createWish({
			listId: params.id,
			userId: locals.user.id,
			name: raw.name.toString(),
			price: raw.price?.toString?.() ?? null,
			description: raw.description?.toString?.() ?? null
		});
	},

	toggle_done: async ({ locals, request }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		// TODO: validation
		const { id } = Object.fromEntries(await request.formData());

		const whereQuery = and(
			eq(wishStatusTable.userId, locals.user.id),
			eq(wishStatusTable.wishId, id.toString())
		);

		const existing = await db.query.wishStatusTable.findFirst({
			where: whereQuery,
			columns: { status: true }
		});

		if (!existing) error(400, 'not in buylist');

		await db
			.update(wishStatusTable)
			.set({
				status: existing.status === 'pending' ? 'confirmed' : 'pending'
			})
			.where(whereQuery);
	}
};
