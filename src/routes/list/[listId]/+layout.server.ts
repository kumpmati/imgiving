import { getListWithUsers } from '$lib/server/db/handlers/list.js';
import { getListMember } from '$lib/server/db/handlers/listUser.js';
import { getUnreadQuestions } from '$lib/server/db/handlers/questions.js';

import { getBuylist } from '$lib/server/db/handlers/wish';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	if (!locals.user) error(403, 'not signed in'); // TODO: handle auth redirect

	const [list, buylist, member] = await Promise.all([
		getListWithUsers(params.listId),
		getBuylist(params.listId, locals.user.id),
		getListMember(params.listId, locals.user.id)
	]);

	if (!list) {
		error(404, 'list not found');
	}

	return {
		list,
		buylist,
		member,

		streamed: {
			unreadQuestions: getUnreadQuestions(params.listId, locals.user.id)
		}
	};
};
