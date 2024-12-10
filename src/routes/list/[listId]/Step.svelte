<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	type Props = {
		href: string;
		icon: string;
		text: string;
		line?: boolean;
		description?: string;
		children: Snippet;
	} & HTMLAnchorAttributes;

	let { href, icon, text, line = true, description, children, ...rest }: Props = $props();

	let active = $derived($page.url.pathname === href);
</script>

<div class="relative flex flex-col">
	<a
		{href}
		class={cn(
			'flex items-baseline gap-2 text-left transition-none hover:text-primary hover:transition-colors',
			active ? 'text-black' : 'text-slate-200'
		)}
		{...rest}
	>
		<p class="flex size-16 flex-shrink-0 items-center justify-center p-2 text-4xl font-extrabold">
			{icon}
		</p>
		<p class="w-fit text-4xl font-extrabold">{text}</p>
	</a>

	{#if line}
		<div
			class="absolute left-8 top-16 m-0 h-[calc(100%-64px)] w-[2px] bg-gradient-to-b from-slate-500 to-slate-100"
		></div>
	{/if}

	{#if active}
		<div class="ml-[72px]">
			{#if description}
				<p class="text-lg font-semibold text-muted-foreground">{description}</p>
			{/if}

			<div class="mb-16 mt-8 h-[calc-size(auto)]" in:fly={{ y: -10, duration: 250 }}>
				{@render children()}
			</div>
		</div>
	{/if}
</div>
