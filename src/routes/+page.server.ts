import { db } from '$lib/server/db';
import { listTable, listUserTable } from '$lib/server/db/schema/list.js';
import { redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/auth/signin');
		}

		const raw = Object.fromEntries(await request.formData()) as { name: string };

		const id = nanoid(15);

		// TODO: do these in a transaction
		await db.insert(listTable).values({
			id,
			name: raw.name,
			authorId: locals.user.id
		});

		await db.insert(listUserTable).values({
			listId: id,
			userId: locals.user.id
		});

		redirect(302, `/list/${id}`);
	}
};
