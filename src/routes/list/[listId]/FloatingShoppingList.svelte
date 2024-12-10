<script lang="ts">
	import { unique } from '$lib/array';
	import type { WishStatus } from '$lib/server/db/schema';
	import TablerUsers from '~icons/tabler/users';

	type Props = {
		users: number;
		items: { id: string; name: string; recipient: string; status: WishStatus['status'] }[];
	};

	let { users, items }: Props = $props();

	let uniqueUsers = $derived(unique(items.map((i) => i.recipient)));
</script>

<div class="flex w-full flex-col gap-2 rounded-md border border-dashed p-4">
	<div class="flex items-center justify-between">
		<p class="text-base font-semibold">Shopping list</p>

		<div
			class="flex items-center gap-1 text-sm text-muted-foreground"
			title="You have gifts for {uniqueUsers.length}/{users} people in this wishlist"
		>
			{uniqueUsers.length}/{users}
			<TablerUsers class="size-4" />
		</div>
	</div>

	{#if items.length > 0}
		<ul class="max-w-80 list-disc pl-5 text-muted-foreground">
			{#each items as item (item.id)}
				<li class={item.status === 'confirmed' ? 'line-through' : ''}>
					<span class="text-sm font-semibold">{item.name}</span> ({item.recipient})
				</li>
			{/each}
		</ul>
	{/if}
</div>
