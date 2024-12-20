import type { User } from '$lib/server/db/schema';
import { getContext, setContext } from 'svelte';

const key = Symbol('user');

export const setUserContext = (u: User | null) => {
	const s = $state({ current: u });
	return setContext(key, s);
};

export const getUserContext = () => getContext<{ current: User | null }>(key);
