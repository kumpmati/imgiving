import { signInFormSchema } from '#lib/v2/components/signIn/schema.js';
import { redirectToSignIn } from '#lib/return.js';
import { setSessionTokenCookie } from '#lib/server/auth/cookies.js';
import { createUserAndSession } from '#lib/server/auth/helpers.js';
import { getListMember, joinList } from '#lib/server/db/handlers/listUser.ts';
import { db } from '#lib/server/db/index.js';
import { listTable } from '#lib/server/db/schema/list.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const list = await db.query.listTable.findFirst({
		where: eq(listTable.publicShareLink, params.id)
	});

	if (!list) {
		error(404, 'invite not found');
	}

	return { list, member: locals.user ? await getListMember(list.id, locals.user.id) : null };
};

export const actions = {
	join: async ({ locals, url, params }) => {
		if (!locals.user) return redirectToSignIn(url);

		const list = await db.query.listTable.findFirst({
			where: eq(listTable.publicShareLink, params.id)
		});

		if (!list) {
			return fail(400, { message: 'invite not found' });
		}

		await joinList(list.id, locals.user.id);

		redirect(302, `/list/${list.id}`);
	},

	signup_and_join: async (e) => {
		const list = await db.query.listTable.findFirst({
			where: eq(listTable.publicShareLink, e.params.id)
		});

		if (!list) {
			return fail(400, { message: 'invite not found' });
		}

		const raw = Object.fromEntries(await e.request.formData());

		const parsed = signInFormSchema.safeParse(raw);
		if (!parsed.success) {
			return error(400, 'invalid name');
		}

		const { session, token } = await createUserAndSession(parsed.data.name);
		setSessionTokenCookie(e, token, session.expiresAt);

		await joinList(list.id, session.userId);
		redirect(302, `/list/${list.id}`);
	}
};
