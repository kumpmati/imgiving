import { deleteSessionTokenCookie } from '$lib/server/auth/cookies';
import { invalidateSession } from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';

export const GET = async (e) => {
	if (e.locals.session) {
		await invalidateSession(e.locals.session.id);
		deleteSessionTokenCookie(e);
	}

	redirect(302, '/');
};
