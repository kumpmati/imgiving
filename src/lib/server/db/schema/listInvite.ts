import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { listTable } from './list';
import { userTable } from './user';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const listInviteTable = pgTable(
	'list_invites',
	{
		id: text('id').notNull().primaryKey(),
		listId: text('list_id')
			.notNull()
			.references(() => listTable.id, { onDelete: 'cascade' }),
		authorId: text('author_id').notNull(),
		createdUserId: text('created_user_id').references(() => userTable.id),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [
		index('list_invite_list_id_index').on(table.listId),
		index('list_invite_author_id_index').on(table.authorId),
		index('list_invite_created_at_index').on(table.createdAt)
	]
);

export const listInviteSchema = createSelectSchema(listInviteTable);
export const listInviteInsertSchema = createInsertSchema(listInviteTable);

export type ListInvite = z.infer<typeof listInviteSchema>;
export type ListInviteInsert = z.infer<typeof listInviteInsertSchema>;
