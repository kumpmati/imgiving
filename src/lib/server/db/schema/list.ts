import { userTable } from './user';
import { index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const listTable = pgTable(
	'lists',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		authorId: text('author_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		createdAtIndex: index('list_created_at_index').on(table.createdAt)
	})
);

export type List = typeof listTable.$inferSelect;
export type ListInsert = typeof listTable.$inferInsert;

export const listUserTable = pgTable(
	'list_users',
	{
		listId: text('list_id')
			.references(() => listTable.id, { onDelete: 'cascade' })
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		// list id is first in the composite key so that index is best optimised for finding all list members
		pk: primaryKey({ columns: [table.listId, table.userId] })
	})
);

export type ListUser = typeof listUserTable.$inferSelect;
