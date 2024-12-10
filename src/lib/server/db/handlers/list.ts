import { eq } from 'drizzle-orm';
import { db } from '..';
import { listTable } from '../schema';

export const getListWithUsers = async (listId: string) => {
	return db.query.listTable.findFirst({
		where: eq(listTable.id, listId),
		with: {
			users: {
				columns: { userId: true, joinedAt: true },
				with: { user: { columns: { name: true } } }
			}
		}
	});
};
