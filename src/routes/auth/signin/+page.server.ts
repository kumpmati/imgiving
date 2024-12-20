import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { setSessionTokenCookie } from '$lib/server/auth/cookies.js';
import { createUserAndSession } from '$lib/server/auth/helpers.js';

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

		const { session, token } = await createUserAndSession(parsed.data.name);
		setSessionTokenCookie(e, token, session.expiresAt);

		redirect(302, '/');
	}
};
