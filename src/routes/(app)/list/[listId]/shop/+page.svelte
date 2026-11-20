<script lang="ts">
	import TablerMessage from '~icons/tabler/message';
	import TablerHelp from '~icons/tabler/help';
	import { cn } from '#lib/utils.ts';
	import { Checkbox } from '#lib/v2/components/ui/checkbox/index.js';
	import * as Table from '#lib/v2/components/ui/table/index.js';
	import { invalidateAll } from '$app/navigation';
	import { Badge } from '#lib/v2/components/ui/badge/index.js';
	import { Button } from '#lib/v2/components/ui/button/index.js';
	import { getChatContext } from '#lib/v3/chat/context.js';
	import { m } from '#lib/paraglide/messages.js';
	import { toggleBuylistChecked } from '#lib/queries/shop.remote.js';

	let { data } = $props();

	const chat = getChatContext();
</script>

<svelte:head>
	<title>{m.pagetitle_shop()} - {data.list.name}</title>
</svelte:head>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="hidden w-0 min-w-20 sm:table-cell" />
			<Table.Head class="w-0" />
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.buylist as wish (wish.id)}
			{@const isDone = wish.status === 'confirmed'}

			<Table.Row>
				<Table.Cell class="align-baseline">
					<div class="flex gap-4">
						<Checkbox
							name="checked"
							class="bg-card mt-[3px]"
							checked={wish.status === 'confirmed'}
							onCheckedChange={() =>
								toggleBuylistChecked({ listId: data.list.id, wishId: wish.id }).then(() =>
									invalidateAll()
								)}
						/>

						<div class={cn('flex flex-col', isDone && 'line-through')}>
							<span class="text-base font-semibold">
								{wish.name}
								<span class="text-muted-foreground font-normal">({wish.recipient})</span>
							</span>

							{#if wish.description}
								<p class="text-muted-foreground text-sm">{wish.description}</p>
							{/if}
						</div>
					</div>
				</Table.Cell>
				<Table.Cell class="hidden align-top sm:table-cell">
					{#if wish.priceCents}
						<Badge class="mt-1 w-max">{wish.priceCents / 100} €</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="align-baseline">
					<div class="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							class="gap-1 px-2"
							title="Questions"
							onclick={() => chat.openQuestions(wish.id, wish.listId)}
						>
							<TablerHelp />
							{wish.numQuestions}
						</Button>

						<Button
							variant="outline"
							size="sm"
							class="gap-1 px-2"
							title="Comments"
							onclick={() => chat.openComments(wish.id, wish.listId)}
						>
							<TablerMessage />
							{wish.numComments}
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
