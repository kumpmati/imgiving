<script lang="ts">
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		href: string;
		children?: Snippet;

		class?: string;
	};

	let { href, children, class: className }: Props = $props();
</script>

<header class={cn('z-10 flex w-full items-center justify-between p-4 sm:top-0', className)}>
	<Logo {href} />

	<nav class="flex items-center gap-2">
		{@render children?.()}
	</nav>
</header>
