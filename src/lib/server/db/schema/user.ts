import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { listUserTable } from './listUser';
import { wishTable } from './wish';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { sessionTable } from './session';

export const userTable = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		googleId: text('google_id'),
		verifiedAt: timestamp('verified_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('user_created_at_index').on(table.createdAt),
		index('user_verified_at_index').on(table.verifiedAt)
	]
);

export const userRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable),
	lists: many(listUserTable),
	wishes: many(wishTable)
}));

export const userSchema = createSelectSchema(userTable);
export const userInsertSchema = createInsertSchema(userTable);

export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
