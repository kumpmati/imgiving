import {
	getComments,
	getQuestions,
	markQuestionsAsSeen,
	sendComment,
	sendQuestion
} from '#lib/queries/chat.remote.ts';
import type { ChatSheetContext } from './context';

export class ChatSheetState {
	current = $state<ChatSheetContext>({
		open: false,
		loading: false,
		type: 'comments',
		wish: null,
		listId: null,
		messages: []
	});

	async openComments(wishId: string, listId: string) {
		try {
			this.clear();
			this.current = { ...this.current, loading: true, open: true, type: 'comments' };

			const result = await getComments({ wishId, listId });

			this.current = {
				...this.current,
				messages: result.comments,
				wish: result.wish,
				listId: result.wish.listId
			};
		} finally {
			this.current.loading = false;
		}
	}

	async openQuestions(wishId: string, listId: string) {
		try {
			this.clear();
			this.current = { ...this.current, loading: true, open: true, type: 'questions' };

			const result = await getQuestions({ wishId, listId });

			this.current = {
				...this.current,
				messages: result.questions,
				wish: result.wish,
				listId: result.wish.listId
			};
		} finally {
			this.current.loading = false;
		}
	}

	async sendComment(userId: string, message: string) {
		if (!this.current.wish || !this.current.listId) return;

		const comment = await sendComment({
			wishId: this.current.wish.id,
			listId: this.current.listId,
			userId,
			message
		});
		this.current.messages.push(comment);
	}

	async sendQuestion(userId: string, message: string) {
		if (!this.current.wish || !this.current.listId) return;

		const question = await sendQuestion({
			wishId: this.current.wish.id,
			listId: this.current.listId,
			userId,
			message
		});
		this.current.messages.push(question);
	}

	async markQuestionsAsSeen(wishId: string, listId: string) {
		return markQuestionsAsSeen({ listId, wishId });
	}

	private clear() {
		this.current.wish = null;
		this.current.messages = [];
		this.current.listId = null;
	}
}
