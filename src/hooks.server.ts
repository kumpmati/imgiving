import {
	deleteSessionTokenCookie,
	getSessionTokenCookie,
	setSessionTokenCookie
} from '#lib/server/auth/cookies.ts';
import { validateSessionToken } from '#lib/server/auth/session.ts';
import { paraglideMiddleware } from '#lib/paraglide/server.js';

// TODO: consider caching sessions / users?

export function handle({ event, resolve }) {
	return paraglideMiddleware(event.request, async ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;

		const token = getSessionTokenCookie(event);
		if (!token) {
			event.locals.user = null;
			event.locals.session = null;

			return resolve(event, {
				transformPageChunk: ({ html }) => {
					return html.replace('%lang%', locale);
				}
			});
		}

		const { session, user } = await validateSessionToken(token);
		if (session) {
			setSessionTokenCookie(event, token, session.expiresAt);
		} else {
			deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;

		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});
}
