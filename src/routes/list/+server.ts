import { joinList, leaveList } from '$lib/server/db/handlers/listUser';
import { error, redirect } from '@sveltejs/kit';
import { endpoint, zod } from 'sveltekit-superactions';
import { z } from 'zod';

export const POST = endpoint({
	joinList: zod(z.string(), async ({ locals }, listId) => {
		if (!locals.user) error(403); // TODO: handle auth redirect
		await joinList(listId, locals.user.id);
	}),

	leaveList: zod(z.string(), async ({ locals }, listId) => {
		if (!locals.user) error(403); // TODO: handle auth redirect
		await leaveList(listId, locals.user.id);
		redirect(302, '/');
	})
});

export type ListEndpoint = typeof POST;
