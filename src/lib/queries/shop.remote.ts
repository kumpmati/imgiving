import { getListMember } from '#lib/server/db/handlers/listUser.ts';
import { getWishStatus, updateWishStatus } from '#lib/server/db/handlers/wishStatus.ts';
import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	listId: z.string(),
	wishId: z.string()
});

export const toggleBuylistChecked = command(schema, async (body) => {
	const { locals } = getRequestEvent();

	if (!locals.user) error(401);
	if (!(await getListMember(body.listId, locals.user.id))) error(403);

	// TODO: make sure the wish is inside the given list

	const existing = await getWishStatus(body.wishId, locals.user.id);
	if (!existing) error(400, 'not in shopping list');

	await updateWishStatus(body.wishId, locals.user.id, {
		status: existing.status === 'pending' ? 'confirmed' : 'pending'
	});
});
