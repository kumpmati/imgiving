import { eq } from 'drizzle-orm';
import { db } from '..';
import { userTable } from '../schema';

export const getUserByGoogleId = async (googleId: string) => {
	return db.query.userTable.findFirst({ where: eq(userTable.googleId, googleId) });
};
