import { getListMember } from '$lib/server/db/handlers/listUser';
import { getAllWishesWithStatuses } from '$lib/server/db/handlers/wish';
import {
	createWishStatus,
	deleteWishStatus,
	getWishStatus
} from '$lib/server/db/handlers/wishStatus.js';
import { wishStatusInsertSchema } from '$lib/server/db/schema/wishStatus.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(401);

	const wishes = await getAllWishesWithStatuses(params.listId, locals.user.id);

	return { wishes };
};

export const actions = {
	toggle_wish_status: async ({ params, request, locals }) => {
		if (!locals.user) error(401);
		if (!(await getListMember(params.listId, locals.user.id))) error(403);

		const raw = Object.fromEntries(await request.formData());

		const parsed = wishStatusInsertSchema.pick({ wishId: true }).safeParse(raw);
		if (!parsed.success) {
			error(400, 'invalid wish id');
		}

		// TODO: error handling
		const existing = await getWishStatus(parsed.data.wishId, locals.user.id);
		if (existing) {
			await deleteWishStatus(parsed.data.wishId, locals.user.id);
		} else {
			await createWishStatus({
				wishId: parsed.data.wishId,
				userId: locals.user.id,
				status: 'pending'
			});
		}
	}
};
