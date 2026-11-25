import { getBackUrl } from '#lib/return.js';
import { google } from '#lib/server/auth/google.js';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export const GET: RequestHandler = ({ cookies, url }) => {
	const state = generateState();
	const verifier = generateCodeVerifier();
	const authUrl = google.createAuthorizationURL(state, verifier, ['openid', 'profile']);

	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});
	cookies.set('google_code_verifier', verifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});

	const backUrl = getBackUrl(url);

	if (backUrl) {
		cookies.set('auth_back_url', backUrl, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});
	}

	redirect(302, authUrl, {external: true});
};
