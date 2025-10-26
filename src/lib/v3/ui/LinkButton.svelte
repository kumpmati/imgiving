<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		children?: Snippet;
		class?: string;
	};

	let { href, children, class: classes }: Props = $props();
</script>

<a
	{href}
	class={cn(
		'flex gap-2 rounded-full bg-slate-100 px-6 py-2 hover:cursor-pointer hover:bg-slate-200',
		classes
	)}
>
	{@render children?.()}
</a>
