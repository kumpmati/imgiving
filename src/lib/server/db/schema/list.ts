import { relations } from 'drizzle-orm';
import { userTable } from './user';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { listUserTable } from './listUser';
import { wishTable } from './wish';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

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
	(table) => [index('list_created_at_index').on(table.createdAt)]
);

export const listRelations = relations(listTable, ({ many }) => ({
	users: many(listUserTable),
	wishes: many(wishTable)
}));

export const listSchema = createSelectSchema(listTable);
export const listInsertSchema = createInsertSchema(listTable);

export type List = z.infer<typeof listSchema>;
export type ListInsert = z.infer<typeof listInsertSchema>;
