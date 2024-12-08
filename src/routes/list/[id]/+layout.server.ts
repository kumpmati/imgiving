import { db } from '$lib/server/db/index.js';
import { listTable, listUserTable } from '$lib/server/db/schema/list.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const [list] = await db.select().from(listTable).where(eq(listTable.id, params.id));
	if (!list) {
		error(404, 'list not found');
	}

	const members = await db.select().from(listUserTable).where(eq(listUserTable.listId, params.id));

	return { list, members };
};
