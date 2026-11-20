<script lang="ts">
	import '../app.css';
	import { Toasts } from '#lib/v2/components/toasts/state.svelte.ts';
	import Toaster from '#lib/v2/components/toasts/Toaster.svelte';
	import { onMount, setContext } from 'svelte';
	import { toastKey } from '#lib/v2/components/toasts/context.ts';
	import { setChatContext } from '#lib/v3/chat/context.js';
	import { ChatSheetState } from '#lib/v3/chat/state.svelte.ts';
	import { NotificationContext } from '#lib/v2/components/notifications/context.svelte.ts';
	import { setUserContext } from '#lib/state/userContext.js';
	import { setNotificationContext } from '#lib/v2/components/notifications/context.js';

	let { children, data } = $props();

	const chatState = new ChatSheetState();
	setChatContext(chatState);

	const toastState = setContext(toastKey, new Toasts());
	const userState = setUserContext(() => data.user);
	const notifications = setNotificationContext(new NotificationContext(toastState));

	onMount(() => {
		const unsub = notifications.subscribe();
		return () => unsub?.();
	});
</script>

{@render children()}

<Toaster state={toastState} />
