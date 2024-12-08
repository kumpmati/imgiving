import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { listTable } from './list';
import { relations } from 'drizzle-orm';

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

		updatedAt: timestamp('updated_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		listIdIndex: index('wish_list_id_index').on(table.listId),
		userIdIndex: index('wish_user_id_index').on(table.userId)
	})
);

export type Wish = typeof wishTable.$inferSelect;
export type WishInsert = typeof wishTable.$inferInsert;

export const wishRelations = relations(wishTable, ({ one }) => ({
	list: one(listTable, { fields: [wishTable.listId], references: [listTable.id] }),
	user: one(userTable, { fields: [wishTable.userId], references: [userTable.id] })
}));
