import type { ChatMessage } from '#lib/chat.ts';
import type { Wish } from '#lib/server/db/schema/index.ts';
import { createContext } from 'svelte';
import { ChatSheetState } from './state.svelte';

export const [getChatContext, setChatContext] = createContext<ChatSheetState>();

export type ChatSheetContext = {
	open: boolean;
	loading: boolean;
	type: 'comments' | 'questions';
	listId: string | null;
	wish: (Wish & { user: { name: string } }) | null;
	messages: ChatMessage[];
};
