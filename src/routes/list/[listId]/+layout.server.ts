import { getListWithUsers } from '$lib/server/db/handlers/list.js';
import { getBuylist } from '$lib/server/db/handlers/wish';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(403, 'not signed in'); // TODO: handle auth redirect

	const [list, buylist] = await Promise.all([
		getListWithUsers(params.listId),
		getBuylist(params.listId, locals.user.id)
	]);

	if (!list) {
		error(404, 'list not found');
	}

	return { list, buylist };
};
