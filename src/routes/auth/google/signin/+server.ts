import { google } from '$lib/server/auth/google.js';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export const GET = async ({ cookies }) => {
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

	redirect(302, authUrl);
};
