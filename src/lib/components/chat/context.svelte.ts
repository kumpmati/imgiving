import type { ChatMessage } from '$lib/chat';
import type { Wish } from '$lib/server/db/schema';
import { getContext } from 'svelte';
import { ChatSheetState } from './state.svelte';

export const chatSheetKey = Symbol('chat-sheet');

export const getChatContext = () => getContext<ChatSheetState>(chatSheetKey);

export type ChatSheetContext = {
	open: boolean;
	loading: boolean;
	type: 'comments' | 'questions';
	listId: string | null;
	wish: (Wish & { user: { name: string } }) | null;
	messages: ChatMessage[];
};
