import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { listUserTable } from './listUser';
import { wishTable } from './wish';

export const userTable = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		createdAtIndex: index('user_created_at_index').on(table.createdAt)
	})
);

export type User = typeof userTable.$inferSelect;
export type UserInsert = typeof userTable.$inferInsert;

export const userRelations = relations(userTable, ({ many }) => ({
	lists: many(listUserTable),
	wishes: many(wishTable)
}));
