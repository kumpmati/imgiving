import { error, redirect } from '@sveltejs/kit';
import { setSessionTokenCookie } from '$lib/server/auth/cookies.js';
import { createUserAndSession } from '$lib/server/auth/helpers.js';
import { getBackUrl } from '$lib/return.js';
import { signInFormSchema } from '$lib/v2/components/signIn/schema';

export const actions = {
	default: async (e) => {
		const raw = Object.fromEntries(await e.request.formData());

		const parsed = signInFormSchema.safeParse(raw);
		if (!parsed.success) {
			return error(400, 'invalid name');
		}

		const { session, token } = await createUserAndSession(parsed.data.name);
		setSessionTokenCookie(e, token, session.expiresAt);

		redirect(302, getBackUrl(e.url) ?? '/');
	}
};
