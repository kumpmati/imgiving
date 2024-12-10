<script lang="ts">
	import TablerMessage from '~icons/tabler/message';
	import TablerHelp from '~icons/tabler/help';
	import { cn } from '$lib/utils';
	import { Checkbox } from '$ui/checkbox';
	import * as Table from '$ui/table';
	import { superActions } from 'sveltekit-superactions';
	import type { ShopEndpoint } from './+server.js';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { Badge } from '$ui/badge';
	import Button from '$ui/button/button.svelte';

	let { data } = $props();

	const actions = superActions<ShopEndpoint>($page.url.pathname);
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="min-w-20"></Table.Head>
			<Table.Head class="w-0"></Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.buylist as wish (wish.id)}
			{@const isDone = wish.status === 'confirmed'}

			<Table.Row>
				<Table.Cell>
					<div class="flex gap-4">
						<Checkbox
							name="checked"
							class="mt-1"
							checked={wish.status === 'confirmed'}
							onCheckedChange={() =>
								actions.toggleBuylistChecked({ wishId: wish.id }).then(() => invalidateAll())}
						/>

						<div class={cn('flex flex-col', isDone && 'line-through')}>
							<span class="text-base font-semibold">
								{wish.name}
								<span class="font-normal text-muted-foreground">({wish.recipient})</span>
							</span>

							{#if wish.description}
								<p class="text-sm text-muted-foreground">{wish.description}</p>
							{/if}
						</div>
					</div>
				</Table.Cell>
				<Table.Cell class="align-baseline">
					{#if wish.price}
						<Badge class="w-max">{wish.price}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="align-baseline">
					<div class="flex gap-1">
						<Button variant="outline" class="px-2" title="Questions">
							<TablerHelp />
						</Button>

						<Button variant="outline" class="px-2" title="Comments">
							<TablerMessage />
						</Button>
					</div>
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={4}>
					<p class="text-muted-foreground text-sm">Your shopping list is empty.</p>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
