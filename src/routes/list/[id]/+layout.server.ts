import { listTable } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, params }) => {
	const [list] = await locals.db.select().from(listTable).where(eq(listTable.id, params.id));

	if (!list) {
		error(404, 'list not found');
	}

	return { list };
};
