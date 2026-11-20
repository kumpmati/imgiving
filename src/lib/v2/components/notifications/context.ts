import { createContext } from 'svelte';
import type { NotificationContext } from './context.svelte';

export const [getNotificationContext, setNotificationContext] =
	createContext<NotificationContext>();
