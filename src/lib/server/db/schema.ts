import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const listTable = sqliteTable(
	'lists',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
	},
	(table) => ({
		createdAtIndex: index('list_created_at_index').on(table.createdAt)
	})
);

export type List = typeof listTable.$inferSelect;

export const userTable = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
	},
	(table) => ({
		createdAtIndex: index('user_created_at_index').on(table.createdAt)
	})
);

export type User = typeof userTable.$inferSelect;
