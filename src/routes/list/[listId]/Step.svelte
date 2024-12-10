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
		data-sveltekit-keepfocus
		{href}
		class={cn(
			'flex w-fit items-baseline gap-2 text-left text-2xl transition-none hover:text-primary hover:transition-colors sm:text-4xl',
			active ? 'text-black' : 'hidden text-slate-200 sm:flex'
		)}
		{...rest}
	>
		<p class="hidden size-16 flex-shrink-0 items-center justify-center p-2 font-extrabold sm:flex">
			{icon}
		</p>
		<p class="w-fit font-extrabold">{text}</p>
	</a>

	{#if line && active}
		<div
			class="absolute left-8 top-16 m-0 hidden h-[calc(100%-64px)] w-[2px] bg-gradient-to-b from-slate-500 to-slate-100 sm:block"
		></div>
	{/if}

	{#if active}
		<div class="sm:ml-[72px]">
			{#if description}
				<p
					class="text-base font-semibold text-muted-foreground sm:text-lg"
					in:fly|global={{ duration: 300, y: -10 }}
				>
					{description}
				</p>
			{/if}

			<div class="mb-16 mt-4 sm:mt-6" in:fly={{ y: -10, duration: 300, delay: 50 }}>
				{@render children()}
			</div>
		</div>
	{/if}
</div>
