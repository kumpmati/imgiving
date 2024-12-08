import { userTable } from '$lib/server/db/schema/user.js';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import dayjs from 'dayjs';

const createUserSchema = z.object({
	name: z.string().max(40).min(1)
});

export const actions = {
	default: async ({ locals, request, cookies }) => {
		// TODO: handle multiple accounts on one user

		const raw = Object.fromEntries(await request.formData());

		const parsed = createUserSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400);
		}

		const userId = `u:${nanoid(32)}`;

		await locals.db
			.insert(userTable)
			.values({ id: userId, name: parsed.data.name, createdAt: new Date() });

		cookies.set('auth_session', userId, {
			path: '/',
			httpOnly: true,
			expires: dayjs().add(1, 'year').toDate()
		});

		redirect(302, '/');
	}
};
