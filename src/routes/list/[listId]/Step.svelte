<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	type Props = {
		icon: string;
		text: string;
		active: boolean;
		children: Snippet;
	} & HTMLButtonAttributes;

	let { icon, text, active, children, ...rest }: Props = $props();
</script>

<div class="relative flex flex-col">
	<button
		disabled={active}
		class={cn('flex items-baseline gap-2 text-left', active ? 'text-black' : 'text-slate-200')}
		{...rest}
	>
		<p class="flex size-16 items-center justify-center p-2 text-4xl font-extrabold">{icon}</p>
		<p class="text-4xl font-extrabold">{text}</p>
	</button>

	<!-- Line -->
	<div
		class="absolute left-8 top-16 m-0 h-[calc(100%-64px)] w-[1px] bg-gradient-to-b from-slate-900 to-slate-200"
	></div>

	{#if active}
		<div class="mb-16 ml-[72px] mt-8 h-[calc-size(auto)]" in:fly={{ y: -10, duration: 250 }}>
			{@render children()}
		</div>
	{/if}
</div>
