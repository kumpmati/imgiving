import { and, eq, getTableColumns, gte } from 'drizzle-orm';
import { db } from '..';
import { wishQuestionTable, wishTable } from '../schema';

export const getUnreadQuestions = async (listId: string, userId: string) => {
	return db
		.select({ ...getTableColumns(wishQuestionTable), wishName: wishTable.name })
		.from(wishQuestionTable)
		.innerJoin(
			wishTable,
			and(
				eq(wishQuestionTable.wishId, wishTable.id),
				eq(wishTable.listId, listId), // only given list
				eq(wishTable.userId, userId), // only given user
				gte(wishQuestionTable.createdAt, wishTable.lastSeenQuestionTimestamp) // only messages after last seen timestamp
			)
		)
		.groupBy(wishQuestionTable.id, wishTable.id);
};
