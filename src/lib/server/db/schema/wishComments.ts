import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { relations } from 'drizzle-orm';
import { wishTable } from './wish';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { listTable } from './list';

export const wishQuestionTable = pgTable(
	'wish_questions',
	{
		id: text('id').primaryKey(),
		listId: text('list_id')
			.references(() => listTable.id, { onDelete: 'cascade' })
			.notNull(),
		wishId: text('wish_id')
			.references(() => wishTable.id, { onDelete: 'cascade' })
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('wish_question_wish_id_index').on(table.wishId),
		index('wish_question_created_at_index').on(table.createdAt)
	]
);

export const wishQuestionRelations = relations(wishQuestionTable, ({ one }) => ({
	wish: one(wishTable, { fields: [wishQuestionTable.wishId], references: [wishTable.id] }),
	user: one(userTable, { fields: [wishQuestionTable.userId], references: [userTable.id] })
}));

export const wishQuestionSchema = createSelectSchema(wishQuestionTable);
export const wishQuestionInsertSchema = createInsertSchema(wishQuestionTable, {
	message: z.string().max(300, 'message is too long')
});

export type WishQuestion = z.infer<typeof wishQuestionSchema>;
export type WishQuestionInsert = z.infer<typeof wishQuestionInsertSchema>;

export const wishCommentTable = pgTable(
	'wish_comments',
	{
		id: text('id').primaryKey(),
		listId: text('list_id')
			.references(() => listTable.id, { onDelete: 'cascade' })
			.notNull(),
		wishId: text('wish_id')
			.references(() => wishTable.id, { onDelete: 'cascade' })
			.notNull(),
		userId: text('user_id')
			.references(() => userTable.id, { onDelete: 'cascade' })
			.notNull(),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('wish_comment_wish_id_index').on(table.wishId),
		index('wish_comment_created_at_index').on(table.createdAt)
	]
);

export const wishCommentRelations = relations(wishCommentTable, ({ one }) => ({
	wish: one(wishTable, { fields: [wishCommentTable.wishId], references: [wishTable.id] }),
	user: one(userTable, { fields: [wishCommentTable.userId], references: [userTable.id] })
}));

export const wishCommentSchema = createSelectSchema(wishCommentTable);
export const wishCommentInsertSchema = createInsertSchema(wishCommentTable, {
	message: z.string().max(300, 'message is too long')
});

export type WishComment = z.infer<typeof wishCommentSchema>;
export type WishCommentInsert = z.infer<typeof wishCommentInsertSchema>;
