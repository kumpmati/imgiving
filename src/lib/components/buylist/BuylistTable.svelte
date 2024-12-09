<script lang="ts">
	import TablerCircleCheckFilled from '~icons/tabler/circle-check-filled';
	import TablerHelp from '~icons/tabler/help';
	import type { Wish, WishStatus } from '$lib/server/db/schema';
	import { Badge } from '$ui/badge';
	import { Button } from '$ui/button';
	import * as Table from '$ui/table';
	import { cn } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { flip } from 'svelte/animate';

	type Props = {
		listId: string;
		rows: (Wish & { recipient: string; status: WishStatus['status'] })[];
	};

	let { rows, listId }: Props = $props();
</script>

<Table.Root>
	<Table.Body>
		{#each rows as wish (wish.id)}
			{@const isDone = wish.status === 'confirmed'}
			<tr
				animate:flip={{ duration: 200 }}
				class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
			>
				<Table.Cell class="w-0 align-top">
					<p
						class={cn('py-1 text-base text-muted-foreground', isDone && 'line-through opacity-50')}
					>
						{wish.recipient}
					</p>
				</Table.Cell>
				<Table.Cell>
					<a
						href="/list/{listId}/wish/{wish.id}"
						class={cn(
							'flex w-fit flex-col px-2 py-1 text-base font-semibold hover:text-primary/75',
							isDone && 'opacity-50'
						)}
					>
						<div class="flex items-center gap-2">
							<span class={isDone ? 'line-through' : ''}>
								{wish.name}
							</span>

							{#if wish.price}
								<Badge>{wish.price}</Badge>
							{/if}
						</div>

						<p class="text-sm text-muted-foreground">{wish.description || '-'}</p>
					</a>
				</Table.Cell>
				<Table.Cell class="w-0">
					<div class="grid w-fit grid-cols-[1fr,auto] gap-2">
						<Button
							variant="secondary"
							size="icon"
							class="px-3"
							href="/list/{listId}/wish/{wish.id}/questions"
							title="Ask a question"
						>
							<TablerHelp />
						</Button>

						<form class="contents" method="post" action="?/toggle_done" use:enhance>
							<input type="hidden" name="id" value={wish.id} />
							<Button
								type="submit"
								variant={wish.status === 'confirmed' ? 'default' : 'outline'}
								class={cn(
									'min-w-32 px-3',
									wish.status === 'pending'
										? 'border-green-600 text-green-600 hover:text-green-600'
										: 'bg-green-600 text-white hover:bg-green-700'
								)}
							>
								{#if wish.status === 'pending'}
									Mark as done
								{:else}
									<TablerCircleCheckFilled /> Done
								{/if}
							</Button>
						</form>
					</div>
				</Table.Cell>
			</tr>
		{:else}
			<Table.Row>
				<Table.Cell colspan={3} class="text-base text-muted-foreground">
					You haven't confirmed any of your pending wishes.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
