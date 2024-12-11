import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { wishTable } from './wish';
import { userTable } from './user';
import { relations, sql } from 'drizzle-orm';

export const wishStatusTable = pgTable(
	'wish_status',
	{
		wishId: text('wish_id')
			.references(() => wishTable.id, { onDelete: 'cascade' })
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		status: text('status', { enum: ['pending', 'confirmed'] }).notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.default(sql`NULL`)
			.$onUpdateFn(() => new Date()), // auto-update when this table is updated
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [primaryKey({ columns: [table.wishId, table.userId] })]
);

export type WishStatusInsert = typeof wishStatusTable.$inferInsert;
export type WishStatus = typeof wishStatusTable.$inferSelect;

export const wishStatusRelations = relations(wishStatusTable, ({ one }) => ({
	user: one(userTable, { fields: [wishStatusTable.userId], references: [userTable.id] })
}));
