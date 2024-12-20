import { redirect } from '@sveltejs/kit';

/**
 * Extracts the return url if it exists
 */
export const getBackUrl = (url: string | URL): string | null => {
	const params = url instanceof URL ? url.searchParams : new URLSearchParams(url);
	return params.get('back');
};

export const redirectToSignIn = (currentUrl: string | URL): never => {
	return redirect(302, `/auth/signin?back=${currentUrl}`);
};
