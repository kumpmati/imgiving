import { getListMember } from '$lib/server/db/handlers/listUser';
import { getWishStatus, updateWishStatus } from '$lib/server/db/handlers/wishStatus';
import { error } from '@sveltejs/kit';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const POST = endpoint({
	toggleBuylistChecked: zod(schema, async ({ locals }, body) => {
		if (!locals.user) error(401); // TODO: handle auth redirect
		if (!(await getListMember(body.listId, locals.user.id))) error(403);

		// TODO: make sure the wish is inside the given list

		const existing = await getWishStatus(body.wishId, locals.user.id);
		if (!existing) error(400, 'not in shopping list');

		await updateWishStatus(body.wishId, locals.user.id, {
			status: existing.status === 'pending' ? 'confirmed' : 'pending'
		});
	})
});

export type ShopEndpoint = typeof POST;
