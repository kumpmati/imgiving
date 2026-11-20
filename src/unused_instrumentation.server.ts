// this file is prefixed with unused_ so that sveltekit doesn't load it.
// for some reason it causes a vite import error when used, even though
// this was added using the automated sentry setup.

import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://d2a14530d1dd3edd7a1ff989f3087302@o4512464704372736.ingest.de.sentry.io/4512464707125328',
	// Turns off collection of data that could identify users. Adjust per category:
	// https://docs.sentry.io/platforms/javascript/configuration/options/#dataCollection
	dataCollection: {
		userInfo: false,
		graphQL: { document: false, variables: false },
		genAI: { inputs: false, outputs: false },
		databaseQueryData: false,
		queues: false,
		httpBodies: [],
		httpHeaders: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
		cookies: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
		urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] }
	}
	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
