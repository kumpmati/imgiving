<script lang="ts">
	import '../app.css';
	import { Toasts } from '$lib/components/toasts/state.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';
	import { onMount, setContext } from 'svelte';
	import { toastKey } from '$lib/components/toasts/context';
	import { setUserContext } from '$lib/state/user.svelte';
	import { chatSheetKey } from '$lib/components/chat/context.svelte';
	import { ChatSheetState } from '$lib/components/chat/state.svelte';
	import {
		NotificationContext,
		notificationContextKey
	} from '$lib/components/notifications/context.svelte';

	let { children, data } = $props();

	setContext(chatSheetKey, new ChatSheetState());

	const toastState = setContext(toastKey, new Toasts());
	const userState = setUserContext(data.user);
	const notifications = setContext(notificationContextKey, new NotificationContext(toastState));

	$effect(() => {
		userState.current = data.user;
	});

	onMount(() => {
		const unsub = notifications.subscribe();
		return () => unsub?.();
	});
</script>

{@render children()}

<Toaster state={toastState} />
