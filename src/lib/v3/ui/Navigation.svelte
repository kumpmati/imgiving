<script lang="ts">
	import TablerStar from '~icons/tabler/star';
	import TablerGift from '~icons/tabler/gift';
	import TablerShoppingBag from '~icons/tabler/shopping-bag';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	type Props = {
		listId: string;
	};

	let { listId }: Props = $props();

	// TODO: larger version on desktop?
	const items = [
		{ path: `/list/${listId}`, icon: TablerStar, title: 'Wish' },
		{ path: `/list/${listId}/give`, icon: TablerGift, title: 'Give' },
		{ path: `/list/${listId}/shop`, icon: TablerShoppingBag, title: 'Shop' }
	];
</script>

<nav class="fixed bottom-4 left-1/2 flex -translate-x-1/2 rounded-full bg-white shadow-lg">
	{#each items as item (item.path)}
		<a
			href={item.path}
			class={cn(
				'flex rounded-full px-6 py-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-800',
				page.url.pathname === item.path &&
					'bg-red-600 text-red-50 hover:bg-red-600 hover:text-white'
			)}
		>
			<item.icon width={24} height={24} />
		</a>
	{/each}
</nav>
