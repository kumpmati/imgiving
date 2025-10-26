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
	import { Button } from '$ui/button/index.js';
	import { getChatContext } from '$lib/v3/chat/context.svelte.js';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	const chat = getChatContext();
	const actions = superActions<ShopEndpoint>($page.url.pathname);
</script>

<svelte:head>
	<title>{m.pagetitle_shop()} - {data.list.name}</title>
</svelte:head>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="hidden w-0 min-w-20 sm:table-cell"></Table.Head>
			<Table.Head class="w-0"></Table.Head>
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
							class="mt-[3px] bg-card"
							checked={wish.status === 'confirmed'}
							onCheckedChange={() =>
								actions
									.toggleBuylistChecked({ listId: data.list.id, wishId: wish.id })
									.then(() => invalidateAll())}
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
