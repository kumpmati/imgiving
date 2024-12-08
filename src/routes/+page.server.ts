import { listId } from '$lib/id.js';
import { db } from '$lib/server/db';
import { listTable } from '$lib/server/db/schema/list.js';
import { listUserTable } from '$lib/server/db/schema/listUser';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/auth/signin');
		}

		// TODO: validation
		const raw = Object.fromEntries(await request.formData()) as { name: string };

		const id = listId();

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
