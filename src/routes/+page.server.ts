import { listTable } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const actions = {
	default: async ({ request, locals }) => {
		const raw = Object.fromEntries(await request.formData()) as { name: string };

		const id = nanoid(15);

		await locals.db.insert(listTable).values({ id, name: raw.name, createdAt: new Date() });

		redirect(302, `/list/${id}`);
	}
};
