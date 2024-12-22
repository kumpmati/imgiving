import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const userNotificationsTable = pgTable(
	'user_notifications',
	{
		userId: text('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
		token: text('token').notNull(),

		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`NULL`)
			.$onUpdateFn(() => new Date()), // auto-update when this table is updated
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},

	(table) => [
		// each user+device combo is a separate entry
		primaryKey({ columns: [table.userId, table.token] })
	]
);

export const userNotificationsRelations = relations(userNotificationsTable, ({ one }) => ({
	user: one(userTable, { fields: [userNotificationsTable.userId], references: [userTable.id] })
}));

export const userNotificationSchema = createSelectSchema(userNotificationsTable);
export const userNotificationInsertSchema = createInsertSchema(userNotificationsTable);

export type UserNotifications = z.infer<typeof userNotificationSchema>;
export type UserNotificationsInsert = z.infer<typeof userNotificationInsertSchema>;
