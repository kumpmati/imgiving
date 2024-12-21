import { redirectToSignIn } from '$lib/return.js';
import { getListWithUsers } from '$lib/server/db/handlers/list.js';
import { getListMember } from '$lib/server/db/handlers/listUser.js';
import { getWishesWithUnreadQuestionCount } from '$lib/server/db/handlers/questions.js';
import { getBuylist } from '$lib/server/db/handlers/wish';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params, url }) => {
	if (!locals.user) return redirectToSignIn(url);

	const [list, buylist, member] = await Promise.all([
		getListWithUsers(params.listId),
		getBuylist(params.listId, locals.user.id),
		getListMember(params.listId, locals.user.id)
	]);

	if (!list) {
		error(404, 'list not found');
	}

	if (!member) {
		error(403, 'you are not a member of this wishlist');
	}

	return {
		list,
		buylist,
		member,

		streamed: {
			unreadQuestions: getWishesWithUnreadQuestionCount(params.listId, locals.user.id)
		}
	};
};
