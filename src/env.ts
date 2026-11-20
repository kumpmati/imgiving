import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_FIREBASE_API_KEY: { public: true, static: true },
	PUBLIC_FIREBASE_PROJECT_ID: { public: true, static: true },
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID: { public: true, static: true },
	PUBLIC_FIREBASE_APP_ID: { public: true, static: true },
	PUBLIC_FCM_PUBLIC_KEY: { public: true, static: true },
	FIREBASE_ADMIN_KEY: { static: true },
	DATABASE_URL: { static: true },
	GOOGLE_OAUTH_ID: { static: true },
	GOOGLE_OAUTH_SECRET: { static: true },
	ORIGIN: { static: true }
});
