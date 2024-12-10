import { getWishStatus, updateWishStatus } from '$lib/server/db/handlers/wishStatus';
import { error } from '@sveltejs/kit';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const toggleCheckedSchema = z.object({
	wishId: z.string()
});

export const POST = endpoint({
	toggleBuylistChecked: zod(toggleCheckedSchema, async ({ locals }, body) => {
		if (!locals.user) error(403); // TODO: handle auth redirect

		const existing = await getWishStatus(body.wishId, locals.user.id);
		if (!existing) error(400, 'not in shopping list');

		await updateWishStatus(body.wishId, locals.user.id, {
			status: existing.status === 'pending' ? 'confirmed' : 'pending'
		});
	})
});

export type ShopEndpoint = typeof POST;
