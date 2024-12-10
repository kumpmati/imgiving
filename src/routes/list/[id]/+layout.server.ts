import { getListWithUsers } from '$lib/server/db/handlers/list.js';
import { getOwnWishes } from '$lib/server/db/handlers/wish.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) error(403, 'not signed in'); // TODO: handle auth redirect

	const list = await getListWithUsers(params.id);
	if (!list) {
		error(404, 'list not found');
	}

	return {
		list,
		ownWishes: getOwnWishes(params.id, locals.user.id)
	};
};
