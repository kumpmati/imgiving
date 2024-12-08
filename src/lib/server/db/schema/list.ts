import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export const listTable = sqliteTable(
	'lists',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		authorId: text('author_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.default(sql`NULL`),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
	},
	(table) => ({
		createdAtIndex: index('list_created_at_index').on(table.createdAt)
	})
);

export type List = typeof listTable.$inferSelect;
export type ListInsert = typeof listTable.$inferInsert;
