import { db } from '$lib/server/db';
import { wishTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const editPriceSchema = z.object({
	wishId: z.string(),
	value: z.string().nullable()
});

export const POST = endpoint({
	editWishPrice: zod(editPriceSchema, async ({ locals }, body) => {
		if (!locals.user) error(403);

		const [updated] = await db
			.update(wishTable)
			.set({ price: body.value })
			.where(and(eq(wishTable.userId, locals.user.id), eq(wishTable.id, body.wishId)))
			.returning();

		return updated;
	})
});

export type WishEndpoint = typeof POST;
