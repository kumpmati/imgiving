import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations } from 'drizzle-orm';
import { wishTable } from './wish';

export const wishQuestionTable = pgTable(
	'wish_questions',
	{
		id: text('id').primaryKey(),
		wishId: text('wish_id')
			.references(() => wishTable.id)
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id)
			.notNull(),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		wishIdIndex: index('wish_question_wish_id_index').on(table.wishId),
		createdAtIndex: index('wish_question_created_at_index').on(table.createdAt)
	})
);

export type WishQuestion = typeof wishQuestionTable.$inferSelect;

export const wishQuestionRelations = relations(wishQuestionTable, ({ one }) => ({
	wish: one(wishTable, { fields: [wishQuestionTable.wishId], references: [wishTable.id] })
}));

export const wishCommentTable = pgTable(
	'wish_comments',
	{
		id: text('id').primaryKey(),
		wishId: text('wish_id')
			.references(() => wishTable.id)
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id)
			.notNull(),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => ({
		wishIdIndex: index('wish_comment_wish_id_index').on(table.wishId),
		createdAtIndex: index('wish_comment_created_at_index').on(table.createdAt)
	})
);

export type WishComment = typeof wishCommentTable.$inferSelect;

export const wishCommentRelations = relations(wishCommentTable, ({ one }) => ({
	wish: one(wishTable, { fields: [wishCommentTable.wishId], references: [wishTable.id] }),
	user: one(userTable, { fields: [wishCommentTable.userId], references: [userTable.id] })
}));
