import { getListWithUsers } from '$lib/server/db/handlers/list.js';
import { getBuylist } from '$lib/server/db/handlers/wish';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(403, 'not signed in'); // TODO: handle auth redirect

	const list = await getListWithUsers(params.listId);
	if (!list) {
		error(404, 'list not found');
	}

	// TODO: parallelize or stream
	const buylist = await getBuylist(params.listId, locals.user.id);

	return {
		list,
		buylist
	};
};
