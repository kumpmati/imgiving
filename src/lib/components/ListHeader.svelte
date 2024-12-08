<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	type Props = {
		variant: 'home' | 'subpage';
		children?: Snippet;
	};

	let { variant, children }: Props = $props();
</script>

<header
	class={twMerge(
		'm-3 flex items-center justify-between rounded-md border border-dashed border-red-500 bg-background p-2 shadow-md',
		variant === 'subpage' ? 'border-solid border-slate-200' : ''
	)}
>
	{@render children?.()}
</header>
