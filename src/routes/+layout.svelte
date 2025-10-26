<script lang="ts">
	import '../app.css';
	import { Toasts } from '$lib/v2/components/toasts/state.svelte';
	import Toaster from '$lib/v2/components/toasts/Toaster.svelte';
	import { onMount, setContext } from 'svelte';
	import { toastKey } from '$lib/v2/components/toasts/context';
	import { setUserContext } from '$lib/state/user.svelte';
	import { chatSheetKey } from '$lib/v2/components/chat/context.svelte';
	import { ChatSheetState } from '$lib/v2/components/chat/state.svelte';
	import {
		NotificationContext,
		notificationContextKey
	} from '$lib/v2/components/notifications/context.svelte';

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
