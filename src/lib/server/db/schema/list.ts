import { relations } from 'drizzle-orm';
import { userTable } from './user';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { listUserTable } from './listUser';
import { wishTable } from './wish';

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

export const listRelations = relations(listTable, ({ many }) => ({
	users: many(listUserTable),
	wishes: many(wishTable)
}));
