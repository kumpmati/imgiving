<script>
	import TablerMessage2Question from '~icons/tabler/message-2-question';
	import TablerCircleCheckFilled from '~icons/tabler/circle-check-filled';
	import TablerCircleCheck from '~icons/tabler/circle-check';
	import { Badge } from '$ui/badge';
	import * as Table from '$ui/table';
	import { Button } from '$ui/button';
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';

	let { data } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-0">Recipient</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head class="w-0">Price</Table.Head>
			<Table.Head class="w-0"></Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.wishes as wish (wish.id)}
			{@const status = data.statuses.find((s) => s.wishId === wish.id)}

			<Table.Row class={status ? 'bg-green-50 text-green-600 hover:bg-green-100' : ''}>
				<Table.Cell
					class={cn('text-base text-muted-foreground', status && 'font-semibold text-green-600')}
				>
					{wish.username}
				</Table.Cell>
				<Table.Cell>
					<p class="text-base font-semibold leading-none">{wish.name}</p>
				</Table.Cell>
				<Table.Cell>
					{#if wish.price}
						<Badge class="w-max">{wish.price}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell>
					<div class="flex gap-1">
						{#if wish.numComments + wish.numQuestions > 0}
							<Badge class="w-max">
								<TablerMessage2Question />
								{wish.numComments + wish.numQuestions}
							</Badge>
						{/if}

						<form method="post" action="?/toggle_wish_status" class="contents" use:enhance>
							<input type="hidden" name="id" value={wish.id} />
							<Button
								type="submit"
								variant={status ? 'default' : 'outline'}
								class={cn('px-2', status && 'bg-green-600 hover:bg-green-700')}
							>
								{#if status}
									<TablerCircleCheckFilled class="size-4" />
								{:else}
									<TablerCircleCheck class="size-4" />
								{/if}

								{wish.numGivers}
							</Button>
						</form>
					</div>
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={4}>
					<p class="text-muted-foreground">No wishes found</p>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
