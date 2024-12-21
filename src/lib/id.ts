import { nanoid } from 'nanoid';

export const generateListId = () => nanoid(16);
export const wishId = () => `w:${nanoid(16)}`;
export const chatMessageId = () => `m:${nanoid(16)}`;
export const userId = () => `u:${nanoid(16)}`;
export const publicShareLink = () => `s:${nanoid(24)}`;
