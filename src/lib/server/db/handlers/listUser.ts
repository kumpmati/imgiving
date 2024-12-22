import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { listUserTable } from '../schema';

export const getListMember = async (listId: string, userId: string) => {
	const rows = await db
		.select()
		.from(listUserTable)
		.where(and(eq(listUserTable.listId, listId), eq(listUserTable.userId, userId)));

	return rows.at(0) ?? null;
};

export const joinList = async (listId: string, userId: string) => {
	return db.insert(listUserTable).values({ listId, userId });
};

export const leaveList = async (listId: string, userId: string) => {
	// TODO: also remove wishes from list

	return db
		.delete(listUserTable)
		.where(and(eq(listUserTable.listId, listId), eq(listUserTable.userId, userId)));
};
