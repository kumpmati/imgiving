<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLTextareaAttributes> = $props();
</script>

<textarea
	bind:this={ref}
	class={cn(
		'flex min-h-16 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 bg-transparent px-3 py-2 text-base font-normal text-black transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:border-slate-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	{...restProps}
></textarea>

<style>
	textarea {
		field-sizing: content; /* auto-resize when content changes */
	}
</style>
