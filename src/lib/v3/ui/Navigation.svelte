<script lang="ts">
	import TablerStar from '~icons/tabler/star';
	import TablerStarFilled from '~icons/tabler/star-filled';
	import TablerGift from '~icons/tabler/gift';
	import TablerGiftFilled from '~icons/tabler/gift-filled';
	import TablerShoppingBag from '~icons/tabler/shopping-bag';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';

	type Props = {
		listId: string;
	};

	let { listId }: Props = $props();

	// TODO: larger version on desktop?
	const items = [
		{
			path: `/list/${listId}`,
			icon: TablerStar,
			activeIcon: TablerStarFilled,
			title: m.pagetitle_wish()
		},
		{
			path: `/list/${listId}/give`,
			icon: TablerGift,
			activeIcon: TablerGiftFilled,
			title: m.pagetitle_gift()
		},
		{
			path: `/list/${listId}/shop`,
			icon: TablerShoppingBag,
			activeIcon: TablerShoppingBag,
			title: m.pagetitle_shop()
		}
	];
</script>

<nav
	class="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 overflow-hidden rounded-full bg-white shadow-lg"
>
	{#each items as item (item.path)}
		<a
			href={item.path}
			class={cn(
				'relative flex items-center gap-2 rounded-full px-7 py-2.5 text-slate-500 transition-colors hover:text-red-800',
				page.url.pathname === item.path && 'text-red-50 hover:text-white'
			)}
		>
			{#if page.url.pathname === item.path}
				<div class="absolute inset-0 -inset-x-2 -z-10 rounded-full bg-red-600"></div>

				<item.activeIcon class="size-6" />
			{:else}
				<item.icon class="size-6" />
			{/if}

			<span class="hidden sm:inline">{item.title}</span>
		</a>
	{/each}
</nav>
