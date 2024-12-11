import {
	deleteSessionTokenCookie,
	getSessionTokenCookie,
	setSessionTokenCookie
} from '$lib/server/auth/cookies';
import { validateSessionToken } from '$lib/server/auth/session';

// TODO: consider caching sessions / users?

export async function handle({ event, resolve }) {
	const token = getSessionTokenCookie(event);
	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}
