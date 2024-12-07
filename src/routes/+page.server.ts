import { listTable } from '$lib/server/db/schema.js';

export const load = async ({ locals }) => {
	const rows = await locals.db.select().from(listTable);

	return { rows };
};

export const actions = {
	default: async ({ request, locals }) => {
		const raw = Object.fromEntries(await request.formData()) as { name: string };

		await locals.db.insert(listTable).values({ id: raw.name, createdAt: new Date() });
	}
};
