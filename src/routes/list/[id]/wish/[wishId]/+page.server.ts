import { chatMessageId } from '$lib/id';
import { db } from '$lib/server/db/index.js';
import { wishCommentTable } from '$lib/server/db/schema';
import { wishTable } from '$lib/server/db/schema/wish.js';
import { wishStatusTable } from '$lib/server/db/schema/wishStatus.js';
import { error, redirect } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';

export const load = async ({ parent, params, locals }) => {
	if (!locals.user) error(403, 'unauthorized'); // TODO: handle auth redirect

	const { wish, isOwner } = await parent();

	const wishStatus = await db.query.wishStatusTable.findFirst({
		where: and(
			eq(wishStatusTable.wishId, params.wishId),
			eq(wishStatusTable.userId, locals.user.id)
		),
		columns: { createdAt: true, status: true }
	});

	const givers = await db.query.wishStatusTable.findMany({
		where: eq(wishStatusTable.wishId, params.wishId),
		with: { user: { columns: { name: true } } }
	});

	return {
		wishStatus,
		givers,

		streamed: {
			comments: isOwner
				? null // owner cannot see comments
				: db.query.wishCommentTable.findMany({
						where: eq(wishCommentTable.wishId, wish.id),
						orderBy: asc(wishCommentTable.createdAt) // newest last so that messages are rendered in correct order
					})
		}
	};
};

export const actions = {
	send_comment: async ({ locals, request, params }) => {
		if (!locals.user) error(403, 'unauthorized');

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db.insert(wishCommentTable).values({
			id: chatMessageId(),
			message: raw.message.toString(),
			wishId: params.wishId,
			userId: locals.user.id
		});
	},

	toggle_pending_status: async ({ locals, params }) => {
		if (!locals.user) error(403, 'unauthorized');

		const query = and(
			eq(wishStatusTable.wishId, params.wishId),
			eq(wishStatusTable.userId, locals.user.id)
		);

		const existing = await db.query.wishStatusTable.findFirst({
			where: query
		});

		if (existing) {
			await db.delete(wishStatusTable).where(query);
		} else {
			await db
				.insert(wishStatusTable)
				.values({ wishId: params.wishId, userId: locals.user.id, status: 'pending' });
		}
	},

	edit_wish: async ({ locals, request, params }) => {
		if (!locals.user) error(403, 'unauthorized');

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db
			.update(wishTable)
			.set({
				name: raw.name.toString(),
				price: raw.price?.toString?.() ?? null,
				description: raw.description?.toString?.() ?? null
			})
			.where(
				and(
					eq(wishTable.listId, params.id),
					eq(wishTable.id, params.wishId),
					eq(wishTable.userId, locals.user.id)
				)
			);

		redirect(302, `/list/${params.id}`);
	},

	delete_wish: async ({ locals, params }) => {
		if (!locals.user) error(403, 'unauthorized');

		await db
			.delete(wishTable)
			.where(
				and(
					eq(wishTable.id, params.wishId),
					eq(wishTable.listId, params.id),
					eq(wishTable.userId, locals.user.id)
				)
			);

		redirect(302, `/list/${params.id}`);
	}
};
