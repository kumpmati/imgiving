import { db } from '$lib/server/db/index.js';
import { listTable } from '$lib/server/db/schema/list.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const [list] = await db.select().from(listTable).where(eq(listTable.id, params.id));

	if (!list) {
		error(404, 'list not found');
	}

	return { list };
};
