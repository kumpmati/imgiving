<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		children?: Snippet;
		class?: string;
	} & HTMLButtonAttributes;

	let { children, class: classes, ...rest }: Props = $props();
</script>

<button
	class={cn(
		'flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 font-sans font-semibold text-slate-500 transition-all hover:cursor-pointer hover:bg-slate-200 active:scale-95',
		classes
	)}
	{...rest}
>
	{@render children?.()}
</button>
