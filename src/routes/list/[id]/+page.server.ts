import { wishId } from '$lib/id.js';
import { db } from '$lib/server/db/index.js';
import { listUserTable } from '$lib/server/db/schema/listUser.js';
import { wishTable } from '$lib/server/db/schema/wish.js';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	join: async ({ locals, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		const existing = await db.query.listUserTable.findFirst({
			where: and(eq(listUserTable.listId, params.id), eq(listUserTable.userId, locals.user.id))
		});

		if (existing) {
			return; // do nothing
		}

		await db.insert(listUserTable).values({ listId: params.id, userId: locals.user.id });
	},

	add_wish: async ({ locals, request, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db.insert(wishTable).values({
			id: wishId(),
			listId: params.id,
			userId: locals.user.id,
			name: raw.name.toString(),
			price: raw.price?.toString?.() ?? null,
			description: raw.description?.toString?.() ?? null
		});
	}
};
