import { getAllWishesWithCounts } from '$lib/server/db/handlers/wish';
import {
	createWishStatus,
	deleteWishStatus,
	getWishStatus,
	getWishStatuses
} from '$lib/server/db/handlers/wishStatus.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(403);

	const wishes = await getAllWishesWithCounts(params.listId, locals.user.id);
	const statuses = await getWishStatuses(params.listId, locals.user.id);

	return {
		wishes,
		statuses
	};
};

export const actions = {
	toggle_wish_status: async ({ request, locals }) => {
		if (!locals.user) error(403);

		// TODO: validation
		const { id } = Object.fromEntries(await request.formData());

		// TODO: error handling
		const existing = await getWishStatus(id.toString(), locals.user.id);
		if (existing) {
			await deleteWishStatus(id.toString(), locals.user.id);
		} else {
			await createWishStatus({
				wishId: id.toString(),
				userId: locals.user.id,
				status: 'pending'
			});
		}
	}
};
