import { listId } from '$lib/id.js';
import { db } from '$lib/server/db';
import { listInsertSchema, listTable } from '$lib/server/db/schema/list.js';
import { listUserTable } from '$lib/server/db/schema/listUser';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/auth/signin');
		}

		const raw = Object.fromEntries(await request.formData());

		const parsed = listInsertSchema.pick({ name: true }).safeParse(raw);
		if (!parsed.success) {
			error(400, 'invalid name');
		}

		const id = listId();

		// TODO: do these in a transaction
		await db.insert(listTable).values({
			id,
			name: parsed.data.name,
			authorId: locals.user.id
		});

		await db.insert(listUserTable).values({
			listId: id,
			userId: locals.user.id
		});

		redirect(302, `/list/${id}`);
	}
};
