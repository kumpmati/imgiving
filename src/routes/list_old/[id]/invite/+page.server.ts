import { db } from '$lib/server/db';
import { listTable, listUserTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

// TODO: allow owner to remove other members
export const actions = {
	leave: async ({ locals, params }) => {
		if (!locals.user) return error(403, 'unauthorized');

		const existing = await db.query.listUserTable.findFirst({
			where: and(eq(listUserTable.listId, params.id), eq(listUserTable.userId, locals.user.id))
		});

		if (!existing) {
			return; // do nothing
		}

		// check if user is owner of the list
		const isOwner = await db.query.listTable.findFirst({
			where: and(eq(listTable.id, params.id), eq(listTable.authorId, locals.user.id)),
			columns: { id: true }
		});

		if (isOwner) {
			error(400, 'owner cannot leave');
		}

		// TODO: also remove all items in this wishlist?

		// remove user from list
		await db
			.delete(listUserTable)
			.where(and(eq(listUserTable.listId, params.id), eq(listUserTable.userId, locals.user.id)));
	}
};
