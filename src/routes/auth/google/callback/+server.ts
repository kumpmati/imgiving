import { setSessionTokenCookie } from '#lib/server/auth/cookies.js';
import { google } from '#lib/server/auth/google.js';
import { createUserAndSession } from '#lib/server/auth/helpers.js';
import { createSession, generateSessionToken } from '#lib/server/auth/session.js';
import { getUserByGoogleId } from '#lib/server/db/handlers/user.js';
import { db } from '#lib/server/db/index.js';
import { userTable } from '#lib/server/db/schema/user.js';
import { error, redirect } from '@sveltejs/kit';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { eq } from 'drizzle-orm';

export const GET = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const verifier = event.cookies.get('google_code_verifier') ?? null;

	if (!code || !state || !storedState || !verifier) {
		error(400);
	}

	if (state !== storedState) {
		error(400);
	}

	const backUrl = event.cookies.get('auth_back_url') ?? null;
	event.cookies.delete('auth_back_url', { path: '/' });

	let tokens: OAuth2Tokens;

	try {
		tokens = await google.validateAuthorizationCode(code, verifier);
	} catch {
		error(400);
	}

	const claims = decodeIdToken(tokens.idToken()) as Record<string, string>;
	const googleUserId = claims.sub;
	const username = claims.name;

	const existing = await getUserByGoogleId(googleUserId);
	if (existing) {
		const token = generateSessionToken();
		const session = await createSession(token, existing.id);
		setSessionTokenCookie(event, token, session.expiresAt);

		redirect(302, backUrl ?? '/');
	}

	if (!event.locals.user) {
		// create new user, since not signed in to anonymous account
		const { token, session } = await createUserAndSession(username, googleUserId);
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		// user is already signed in using anonymous account,
		// connect google account to it.
		await db
			.update(userTable)
			.set({ verifiedAt: new Date(), googleId: googleUserId })
			.where(eq(userTable.id, event.locals.user.id));
	}

	redirect(302, backUrl ?? '/');
};
