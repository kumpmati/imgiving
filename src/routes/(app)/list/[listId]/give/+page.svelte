<script lang="ts">
	import TablerCircleCheckFilled from '~icons/tabler/circle-check-filled';
	import TablerCircleCheck from '~icons/tabler/circle-check';
	import { Badge } from '$ui/badge';
	import * as Table from '$ui/table';
	import { Button } from '$ui/button';
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Choose gifts - {data.list.name}</title>
</svelte:head>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="hidden w-0 min-w-16 sm:table-cell">Give to</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head class="hidden w-0 sm:table-cell">Price</Table.Head>
			<Table.Head class="w-0"></Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.wishes as wish (wish.id)}
			{@const status = data.statuses.find((s) => s.wishId === wish.id)}

			<Table.Row class={status ? 'bg-green-50 text-green-600 hover:bg-green-100' : ''}>
				<Table.Cell
					class={cn(
						'hidden text-base text-muted-foreground sm:table-cell',
						status && 'font-semibold text-green-600'
					)}
				>
					{wish.username}
				</Table.Cell>
				<Table.Cell>
					<div class="flex flex-col">
						<small
							class={cn('text-sm text-muted-foreground sm:hidden', status && 'text-green-600')}
						>
							{wish.username}
						</small>
						<p class="text-base font-semibold leading-none">{wish.name}</p>
					</div>
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					{#if wish.price}
						<Badge class="w-max">{wish.price}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="text-right">
					<form method="post" action="?/toggle_wish_status" class="contents" use:enhance>
						<input type="hidden" name="wishId" value={wish.id} />
						<Button
							type="submit"
							variant={status ? 'default' : 'outline'}
							class={cn('px-2', status && 'bg-green-600 hover:bg-green-700')}
							title="{wish.numGivers} are giving {wish.name} to {wish.username}"
						>
							{#if status}
								<TablerCircleCheckFilled class="size-4" />
							{:else}
								<TablerCircleCheck class="size-4" />
							{/if}

							<span class="w-[1ch]">{wish.numGivers}</span>
						</Button>
					</form>
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={4}>
					<p class="text-muted-foreground my-4 text-center">No wishes found</p>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
