import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { db } from '..';
import { userNotificationsTable, wishTable } from '../schema';

export const getWishAuthorNotifications = async (wishId: string) => {
	return db
		.select({
			...getTableColumns(userNotificationsTable),
			wishName: wishTable.name,
			wishUserId: wishTable.userId
		})
		.from(userNotificationsTable)
		.innerJoin(
			wishTable,
			and(eq(wishTable.id, wishId), eq(wishTable.userId, userNotificationsTable.userId))
		);
};

export const deleteByTokens = async (tokens: string[]) => {
	return db.delete(userNotificationsTable).where(inArray(userNotificationsTable.token, tokens));
};
