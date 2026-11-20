import type { User } from '#lib/server/db/schema/index.ts';
import { createContext } from 'svelte';

export const [getUserContext, setUserContext] = createContext<() => User | null>();
