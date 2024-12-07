import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import type { Miniflare } from 'miniflare';

let mf: Miniflare;

export async function handle({ event, resolve }) {
	if (dev) {
		if (!mf) {
			const { Miniflare } = await import('miniflare');
			mf = new Miniflare({
				d1Persist: './miniflare/v3/d1', // migration folder when running `npm run db:migrate:local`
				d1Databases: ['DB'], // this must match d1_databases.binding in wrangler.toml
				script: '',
				modules: true
			});
		}

		event.platform = { env: await mf.getBindings() } as App.Platform;
	}

	if (!event.locals.db) {
		if (!event.platform?.env.DB) error(500, 'invalid configuration');
		event.locals.db = drizzle(event.platform!.env.DB);
	}

	return resolve(event);
}
