import { and, asc, countDistinct, eq, getTableColumns, not } from 'drizzle-orm';
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
		.select()
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId), eq(wishTable.userId, userId)))
		.orderBy(asc(wishTable.createdAt));
};

/**
 * Returns all the wishes in a list except for the given user id.
 * Each wish has the question, comment and giver count included.
 */
export const getAllWishesWithCounts = async (listId: string, excludeUserId: string) => {
	return db
		.select({
			...getTableColumns(wishTable),
			username: userTable.name,
			numQuestions: countDistinct(wishQuestionTable),
			numComments: countDistinct(wishCommentTable),
			numGivers: countDistinct(wishStatusTable)
		})
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId), not(eq(wishTable.userId, excludeUserId))))
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
			recipient: userTable.name,
			numQuestions: countDistinct(wishQuestionTable),
			numComments: countDistinct(wishCommentTable)
		})
		.from(wishTable)
		.where(and(eq(wishTable.listId, listId)))
		.innerJoin(
			wishStatusTable,
			and(eq(wishTable.id, wishStatusTable.wishId), eq(wishStatusTable.userId, userId))
		)
		.innerJoin(userTable, eq(wishTable.userId, userTable.id)) // we can inner join since all wishes have a user;
		.leftJoin(wishQuestionTable, eq(wishTable.id, wishQuestionTable.wishId))
		.leftJoin(wishCommentTable, eq(wishTable.id, wishCommentTable.wishId))
		.groupBy(wishTable.id, wishStatusTable.status, userTable.id);
};
