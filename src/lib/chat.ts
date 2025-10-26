export type ChatMessage = {
	id: string;
	message: string;
	userId: string;
	user?: { name: string };
	createdAt: Date;
};
