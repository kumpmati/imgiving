import { userTable } from '$lib/server/db/schema/user.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import dayjs from 'dayjs';
import { db } from '$lib/server/db/index.js';
import { userId } from '$lib/id.js';

const createUserSchema = z.object({
	name: z.string().max(40).min(1)
});

export const actions = {
	default: async ({ request, cookies }) => {
		// TODO: handle multiple accounts on one user

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		const parsed = createUserSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400);
		}

		const id = userId();

		await db.insert(userTable).values({ id, name: parsed.data.name, createdAt: new Date() });

		cookies.set('auth_session', id, {
			path: '/',
			httpOnly: true,
			expires: dayjs().add(1, 'year').toDate()
		});

		redirect(302, '/');
	}
};
