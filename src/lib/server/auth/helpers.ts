import { userId } from '$lib/id';
import { db } from '../db';
import { userTable } from '../db/schema';
import { createSession, generateSessionToken } from './session';

export const createUserAndSession = async (name: string, googleId?: string) => {
	const uid = userId();

	await db.insert(userTable).values({
		id: uid,
		name,
		googleId,
		verifiedAt: googleId ? new Date() : undefined,
		createdAt: new Date()
	});

	const token = generateSessionToken();
	const session = await createSession(token, uid);

	return { token, session };
};
