import { deleteSessionTokenCookie, getSessionTokenCookie } from '$lib/server/auth/cookies';
import { invalidateSession } from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';

export const GET = async (e) => {
	const token = getSessionTokenCookie(e);
	if (token) {
		await invalidateSession(token);
		deleteSessionTokenCookie(e);
	}

	redirect(302, '/');
};
