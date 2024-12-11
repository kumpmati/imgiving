import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { listTable } from './list';
import { relations, sql } from 'drizzle-orm';
import { wishCommentTable, wishQuestionTable } from './wishComments';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const wishTable = pgTable(
	'wishes',
	{
		id: text('id').primaryKey(),
		listId: text('list_id')
			.references(() => listTable.id)
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id)
			.notNull(),

		name: text('name').notNull(),
		description: text('description'),
		price: text('price'),

		// used to keep track which questions the owner has seen
		lastSeenQuestionTimestamp: timestamp('last_seen_question', { withTimezone: true })
			.notNull()
			.defaultNow(),

		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`NULL`)
			.$onUpdateFn(() => new Date()), // auto-update when this table is updated
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('wish_list_id_index').on(table.listId),
		index('wish_user_id_index').on(table.userId),
		index('wish_created_at_index').on(table.createdAt)
	]
);

export const wishRelations = relations(wishTable, ({ one, many }) => ({
	list: one(listTable, { fields: [wishTable.listId], references: [listTable.id] }),
	user: one(userTable, { fields: [wishTable.userId], references: [userTable.id] }),
	questions: many(wishQuestionTable),
	comments: many(wishCommentTable)
}));

export const wishSchema = createSelectSchema(wishTable);
export const wishInsertSchema = createInsertSchema(wishTable);

export type Wish = z.infer<typeof wishSchema>;
export type WishInsert = z.infer<typeof wishInsertSchema>;
