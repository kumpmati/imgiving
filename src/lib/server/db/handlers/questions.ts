import { and, countDistinct, desc, eq, getTableColumns, gt, not } from 'drizzle-orm';
import { db } from '..';
import { wishQuestionTable, wishTable } from '../schema';

export const getWishesWithUnreadQuestionCount = async (listId: string, userId: string) => {
	return db
		.select({ ...getTableColumns(wishTable), numQuestions: countDistinct(wishQuestionTable) })
		.from(wishTable)
		.where(eq(wishTable.userId, userId)) // only get own wishes
		.leftJoin(
			wishQuestionTable,
			and(
				eq(wishQuestionTable.wishId, wishTable.id),
				eq(wishTable.listId, listId), // only given list
				eq(wishTable.userId, userId), // only given user
				not(eq(wishQuestionTable.userId, userId)), // exclude own messages
				gt(wishQuestionTable.createdAt, wishTable.lastSeenQuestionTimestamp) // only messages after last seen timestamp
			)
		)
		.groupBy(wishTable.id)
		.orderBy(desc(countDistinct(wishQuestionTable.id)));
};

export const markQuestionsAsSeen = async (wishId: string, listId: string, userId: string) => {
	return db
		.update(wishTable)
		.set({ lastSeenQuestionTimestamp: new Date() })
		.where(
			and(eq(wishTable.id, wishId), eq(wishTable.listId, listId), eq(wishTable.userId, userId))
		);
};
