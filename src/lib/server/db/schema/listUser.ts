import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { listTable } from './list';
import { userTable } from './user';
import { relations } from 'drizzle-orm';

export const listUserTable = pgTable(
	'list_users',
	{
		listId: text('list_id')
			.references(() => listTable.id, { onDelete: 'cascade' })
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		// list id is first in the composite key so that index is best optimised for finding all list members
		primaryKey({ columns: [table.listId, table.userId] })
	]
);

export type ListUser = typeof listUserTable.$inferSelect;

export const listUserRelations = relations(listUserTable, ({ one }) => ({
	list: one(listTable, { fields: [listUserTable.listId], references: [listTable.id] }),
	user: one(userTable, { fields: [listUserTable.userId], references: [userTable.id] })
}));
