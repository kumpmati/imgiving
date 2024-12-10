import { getBuylist } from '$lib/server/db/handlers/wish';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) error(403, 'unauthorized'); // TODO: handle auth redirect

	const buylist = await getBuylist(params.listId, locals.user.id);

	return {
		buylist
	};
};
