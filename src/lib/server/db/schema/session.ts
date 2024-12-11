import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const sessionTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id), // TODO: manually delete sessions when user is deleted
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, { fields: [sessionTable.userId], references: [userTable.id] })
}));

export const sessionSchema = createSelectSchema(sessionTable);
export const sessionInsertSchema = createInsertSchema(sessionTable);

export type Session = z.infer<typeof sessionSchema>;
export type SessionInsert = z.infer<typeof sessionInsertSchema>;
