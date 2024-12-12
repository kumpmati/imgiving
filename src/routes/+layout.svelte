<script lang="ts">
	import '../app.css';
	import { Toasts } from '$lib/components/toasts/state.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';
	import { setContext } from 'svelte';
	import { toastKey } from '$lib/components/toasts/context';

	let { children } = $props();

	const state = setContext(toastKey, new Toasts());
</script>

<Toaster {state} />

{@render children()}
