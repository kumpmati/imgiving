<script lang="ts">
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';

	type Props = {
		href: string;
		children?: Snippet;
	};

	let { href, children }: Props = $props();
</script>

<header class="z-10 flex items-center justify-between p-4 sm:sticky sm:top-0">
	<Logo {href} />

	<nav class="flex items-center gap-2">
		{@render children?.()}
	</nav>
</header>
