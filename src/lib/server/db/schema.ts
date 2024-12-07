import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const listTable = sqliteTable('lists', {
	id: text('id').primaryKey(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
});

export type List = typeof listTable.$inferSelect;
