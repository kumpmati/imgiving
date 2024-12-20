import { Google } from 'arctic';
import { GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET, ORIGIN } from '$env/static/private';

export const google = new Google(
	GOOGLE_OAUTH_ID,
	GOOGLE_OAUTH_SECRET,
	`${ORIGIN}/auth/google/callback`
);
