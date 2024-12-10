import { and, asc, count, countDistinct, eq, getTableColumns, gte, not } from 'drizzle-orm';
import { db } from '..';
import {
	userTable,
	wishCommentTable,
	wishQuestionTable,
	wishStatusTable,
	wishTable,
	type WishInsert
} from '../schema';
import { wishId } from '$lib/id';

export const createWish = async (w: Omit<WishInsert, 'id'>) => {
	return db.insert(wishTable).values({ id: wishId(), ...w });
};

export const getOwnWishes = async (listId: string, userId: string) => {
	return db
		.select({ ...getTableColumns(wishTable), numUnreadQuestions: count(wishQuestionTable) })
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId), eq(wishTable.userId, userId)))
		.leftJoin(
			wishQuestionTable,
			and(
				eq(wishTable.id, wishQuestionTable.wishId),
				// filter only questions that haven't been seen by the author
				gte(wishQuestionTable.createdAt, wishTable.lastSeenQuestionTimestamp)
			)
		)
		.groupBy(wishTable.id)
		.orderBy(asc(wishTable.createdAt));
};

/**
 * Returns all the wishes in a list except for the given user id.
 * Each wish has the question, comment and giver count included.
 */
export const getAllWishesWithCounts = async (listId: string, userId: string) => {
	return db
		.select({
			...getTableColumns(wishTable),
			username: userTable.name,
			numQuestions: countDistinct(wishQuestionTable),
			numComments: countDistinct(wishCommentTable),
			numGivers: countDistinct(wishStatusTable)
		})
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId), not(eq(wishTable.userId, userId))))
		.leftJoin(wishQuestionTable, eq(wishTable.id, wishQuestionTable.wishId))
		.leftJoin(wishCommentTable, eq(wishTable.id, wishCommentTable.wishId))
		.leftJoin(wishStatusTable, eq(wishTable.id, wishStatusTable.wishId))
		.innerJoin(userTable, eq(wishTable.userId, userTable.id)) // we can inner join since all wishes have a user;
		.groupBy(wishTable.id, userTable.id);
};

/**
 * Returns all wishes that have a status (e.g. are in the buylist of the user).
 * Each wish also has its status and recipient name included.
 *
 * @param listId
 * @param userId
 */
export const getBuylist = async (listId: string, userId: string) => {
	return db
		.select({
			...getTableColumns(wishTable),
			status: wishStatusTable.status,
			recipient: userTable.name
		})
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId)))
		.innerJoin(
			wishStatusTable,
			and(eq(wishTable.id, wishStatusTable.wishId), eq(wishStatusTable.userId, userId))
		)
		.innerJoin(userTable, eq(wishTable.userId, userTable.id)) // we can inner join since all wishes have a user;
		.groupBy(wishTable.id, wishStatusTable.status, userTable.id);
};
