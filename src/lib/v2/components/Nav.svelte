<script lang="ts">
	import type { Snippet } from 'svelte';
	import Logo from './Logo.svelte';
	import { cn } from '#lib/utils.ts';

	type Props = {
		href: string;
		title?: string;
		children?: Snippet;

		class?: string;
	};

	let { href, title, children, class: className }: Props = $props();
</script>

<header class={cn('z-10 flex w-full items-center justify-between p-4 sm:top-0', className)}>
	<Logo {href} {title} />

	<nav class="flex items-center gap-2">
		{@render children?.()}
	</nav>
</header>
