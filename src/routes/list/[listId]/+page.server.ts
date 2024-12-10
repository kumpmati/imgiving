import { joinList, leaveList } from '$lib/server/db/handlers/listUser.js';
import { error } from '@sveltejs/kit';

export const actions = {
	join_list: async ({ locals, params }) => {
		if (!locals.user) error(403); // TODO: handle auth redirect

		await joinList(params.listId, locals.user.id);
	},

	leave_list: async ({ locals, params }) => {
		if (!locals.user) error(403); // TODO: handle auth redirect

		await leaveList(params.listId, locals.user.id);
	}
};
