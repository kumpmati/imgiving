import { wishId } from '$lib/id.js';
import { db } from '$lib/server/db/index.js';
import {
	userTable,
	wishQuestionTable,
	wishCommentTable,
	wishStatusTable
} from '$lib/server/db/schema';
import { listUserTable } from '$lib/server/db/schema/listUser.js';
import { wishTable } from '$lib/server/db/schema/wish.js';
import { error, fail } from '@sveltejs/kit';
import { and, countDistinct, eq, getTableColumns, not } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	if (!locals.user) error(403, 'unauthorized'); // TODO: handle auth redirect

	// don't await so this is streamed to frontend
	const allWishes = db
		.select({
			...getTableColumns(wishTable),
			username: userTable.name,
			numQuestions: countDistinct(wishQuestionTable),
			numComments: countDistinct(wishCommentTable),
			numGivers: countDistinct(wishStatusTable)
		})
		.from(wishTable)
		.where(
			and(
				eq(wishTable.listId, params.id),
				// exclude own wishes
				not(eq(wishTable.userId, locals.user.id))
			)
		)
		.leftJoin(wishQuestionTable, eq(wishTable.id, wishQuestionTable.wishId))
		.leftJoin(wishCommentTable, eq(wishTable.id, wishCommentTable.wishId))
		.leftJoin(wishStatusTable, eq(wishTable.id, wishStatusTable.wishId))
		.innerJoin(userTable, eq(wishTable.userId, userTable.id)) // we can inner join since all wishes have a user;
		.groupBy(wishTable.id, userTable.id);

	const buylist = await db
		.select({
			...getTableColumns(wishTable),
			status: wishStatusTable.status,
			recipient: userTable.name
		})
		.from(wishTable)
		.where(and(eq(wishTable.listId, params.id)))
		.innerJoin(
			wishStatusTable,
			and(eq(wishTable.id, wishStatusTable.wishId), eq(wishStatusTable.userId, locals.user.id))
		)
		.innerJoin(userTable, eq(wishTable.userId, userTable.id)) // we can inner join since all wishes have a user;
		.groupBy(wishTable.id, wishStatusTable.status, userTable.id);

	return {
		streamed: {
			allWishes,
			buylist
		}
	};
};

export const actions = {
	join: async ({ locals, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		const existing = await db.query.listUserTable.findFirst({
			where: and(eq(listUserTable.listId, params.id), eq(listUserTable.userId, locals.user.id))
		});

		if (existing) {
			return; // do nothing
		}

		await db.insert(listUserTable).values({ listId: params.id, userId: locals.user.id });
	},

	add_wish: async ({ locals, request, params }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		// TODO: validation
		const raw = Object.fromEntries(await request.formData());

		await db.insert(wishTable).values({
			id: wishId(),
			listId: params.id,
			userId: locals.user.id,
			name: raw.name.toString(),
			price: raw.price?.toString?.() ?? null,
			description: raw.description?.toString?.() ?? null
		});
	},

	toggle_done: async ({ locals, request }) => {
		if (!locals.user) return fail(403); // TODO: handle auth redirect

		// TODO: validation
		const { id } = Object.fromEntries(await request.formData());

		const whereQuery = and(
			eq(wishStatusTable.userId, locals.user.id),
			eq(wishStatusTable.wishId, id.toString())
		);

		const existing = await db.query.wishStatusTable.findFirst({
			where: whereQuery,
			columns: { status: true }
		});

		if (!existing) error(400, 'not in buylist');

		await db
			.update(wishStatusTable)
			.set({
				status: existing.status === 'pending' ? 'confirmed' : 'pending'
			})
			.where(whereQuery);
	}
};
