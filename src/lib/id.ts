import { nanoid } from 'nanoid';

export const listId = () => nanoid(10);
export const wishId = () => nanoid(18);
export const chatMessageId = () => `m:${nanoid(20)}`;
export const userId = () => `u:${nanoid(21)}`;
