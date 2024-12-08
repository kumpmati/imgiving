<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		variant: 'home' | 'subpage';
		children?: Snippet;
		sticky?: boolean;
	};

	let { variant, children, sticky }: Props = $props();
</script>

<header
	class={cn(
		'm-3 mb-0 flex items-center justify-between rounded-md border border-dashed border-red-500 bg-background p-2',
		variant === 'subpage' ? 'border-solid border-slate-200 shadow-md' : '',
		sticky && 'sticky top-3'
	)}
>
	{@render children?.()}
</header>
