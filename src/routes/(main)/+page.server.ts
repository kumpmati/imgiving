import { generateListId, publicShareLink } from '#lib/id.js';
import { setSessionTokenCookie } from '#lib/server/auth/cookies.js';
import { createUserAndSession } from '#lib/server/auth/helpers.js';
import { db } from '#lib/server/db/index.ts';
import { listTable } from '#lib/server/db/schema/list.ts';
import { listUserTable } from '#lib/server/db/schema/listUser.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

const schema = z.object({
	user_name: z.string().optional(),
	wishlist_name: z
		.string()
		.min(1, 'wishlist name is too short')
		.max(40, 'wishlist name is too long')
});

export const actions = {
	create_list: async (e) => {
		const raw = Object.fromEntries(await e.request.formData());

		const parsed = schema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, { message: fromError(parsed.error).message });
		}

		let uid: string;

		if (!e.locals.user) {
			if (!parsed.data.user_name) {
				return fail(400, { message: 'your name is required' });
			}

			const { token, session } = await createUserAndSession(parsed.data.user_name);
			setSessionTokenCookie(e, token, session.expiresAt);
			uid = session.userId;
		} else {
			uid = e.locals.user.id;
		}

		if (!uid) {
			return fail(400, { message: 'not signed in and user creation failed' });
		}

		const listId = generateListId();

		// TODO: do these in a transaction
		await db.insert(listTable).values({
			id: listId,
			name: parsed.data.wishlist_name,
			authorId: uid,
			publicShareLink: publicShareLink()
		});

		await db.insert(listUserTable).values({
			listId: listId,
			userId: uid
		});

		redirect(302, `/list/${listId}`);
	}
};
