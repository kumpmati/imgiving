import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { listUserTable } from '../schema';

export const getListMember = async (listId: string, userId: string) => {
	return db.query.listUserTable.findFirst({
		where: and(eq(listUserTable.listId, listId), eq(listUserTable.userId, userId))
	});
};

export const joinList = async (listId: string, userId: string) => {
	return db.insert(listUserTable).values({ listId, userId });
};
