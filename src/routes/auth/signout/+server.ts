import { deleteSessionTokenCookie } from '#lib/server/auth/cookies.ts';
import { invalidateSession } from '#lib/server/auth/session.ts';
import { redirect } from '@sveltejs/kit';

export const GET = async (e) => {
	if (e.locals.session) {
		await invalidateSession(e.locals.session.id);
		deleteSessionTokenCookie(e);
	}

	redirect(302, '/');
};
