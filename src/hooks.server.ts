import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema/user';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
	const userIdCookie = event.cookies.get('auth_session');
	if (userIdCookie) {
		const [user] = await db.select().from(userTable).where(eq(userTable.id, userIdCookie));
		event.locals.user = user;
	}

	return resolve(event);
}
