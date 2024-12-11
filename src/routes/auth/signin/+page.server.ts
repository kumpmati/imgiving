import { userTable } from '$lib/server/db/schema/user.js';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/index.js';
import { userId } from '$lib/id.js';
import { createSession, generateSessionToken } from '$lib/server/auth/session.js';
import { setSessionTokenCookie } from '$lib/server/auth/cookies.js';

const createUserSchema = z.object({
	name: z.string().max(40).min(1)
});

export const actions = {
	default: async (e) => {
		const raw = Object.fromEntries(await e.request.formData());

		const parsed = createUserSchema.safeParse(raw);
		if (!parsed.success) {
			return error(400, 'invalid name');
		}

		const id = userId();

		await db.insert(userTable).values({ id, name: parsed.data.name, createdAt: new Date() });

		const token = generateSessionToken();
		const session = await createSession(token, id);

		setSessionTokenCookie(e, token, session.expiresAt);

		redirect(302, '/');
	}
};
