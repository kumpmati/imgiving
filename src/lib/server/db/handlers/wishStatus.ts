import { and, eq, getTableColumns } from 'drizzle-orm';
import { db } from '..';
import { wishStatusTable, wishTable, type WishStatus, type WishStatusInsert } from '../schema';

/**
 * Returns all wish statuses for the given user in the given list
 */
export const getWishStatuses = async (listId: string, userId: string) => {
	return db
		.select({ ...getTableColumns(wishStatusTable) })
		.from(wishStatusTable)
		.where(eq(wishStatusTable.userId, userId))
		.innerJoin(wishTable, eq(wishTable.listId, listId))
		.groupBy(wishStatusTable.wishId, wishStatusTable.userId);
};

export const getWishStatus = async (wishId: string, userId: string) => {
	return db.query.wishStatusTable.findFirst({
		where: and(eq(wishStatusTable.wishId, wishId), eq(wishStatusTable.userId, userId))
	});
};

export const updateWishStatus = async (
	wishId: string,
	userId: string,
	val: Partial<WishStatus>
) => {
	return db
		.update(wishStatusTable)
		.set(val)
		.where(and(eq(wishStatusTable.wishId, wishId), eq(wishStatusTable.userId, userId)));
};

export const createWishStatus = async (ws: WishStatusInsert) => {
	return db.insert(wishStatusTable).values(ws);
};

export const deleteWishStatus = async (wishId: string, userId: string) => {
	return db
		.delete(wishStatusTable)
		.where(and(eq(wishStatusTable.wishId, wishId), eq(wishStatusTable.userId, userId)));
};
