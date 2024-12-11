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
	import { buttonVariants } from '$ui/button/button.svelte';
	import * as Sheet from '$ui/sheet/index.js';
	import Chat from '$lib/components/chat/Chat.svelte';
	import type { ChatMessage } from '$lib/chat.js';
	import type { ListEndpoint } from '../../+server.js';

	let { data } = $props();

	const actions = superActions<ShopEndpoint>($page.url.pathname);
	let messageActions = superActions<ListEndpoint>('/list');

	let messages = $state<ChatMessage[]>([]);
</script>

<svelte:head>
	<title>Shopping list - {data.list.name}</title>
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
				<Table.Cell class="hidden align-top sm:table-cell">
					{#if wish.price}
						<Badge class="mt-1 w-max">{wish.price}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="align-baseline">
					<div class="flex gap-1">
						<Sheet.Root
							onOpenChange={(open) => {
								if (open) {
									messages = [];
									messageActions.getWishQuestions({ wishId: wish.id }).then((d) => (messages = d));
								}
							}}
						>
							<Sheet.Trigger
								class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 px-2')}
								title="Questions"
							>
								<TablerHelp />
								{wish.numQuestions}
							</Sheet.Trigger>

							<Sheet.Content side="right">
								<Sheet.Header>
									<Sheet.Title class="inline-flex items-center gap-1">
										<TablerHelp />
										{wish.name}
									</Sheet.Title>
									<Sheet.Description>
										Questions are anonymous and visible to everyone including the recipient ({wish.recipient}).
									</Sheet.Description>
								</Sheet.Header>

								<Chat
									wishId={wish.id}
									description={null}
									currentUserId={data.user?.id}
									{messages}
									formaction="?/send_question"
									onsubmit={() => {
										messageActions
											.getWishQuestions({ wishId: wish.id })
											.then((d) => (messages = d));
									}}
								/>
							</Sheet.Content>
						</Sheet.Root>

						<Sheet.Root
							onOpenChange={(open) => {
								if (open) {
									messages = [];
									messageActions.getWishComments({ wishId: wish.id }).then((d) => (messages = d));
								}
							}}
						>
							<Sheet.Trigger
								class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 px-2')}
								title="Comments"
							>
								<TablerMessage />
								{wish.numComments}
							</Sheet.Trigger>

							<Sheet.Content side="right">
								<Sheet.Header>
									<Sheet.Title class="inline-flex items-center gap-1">
										<TablerMessage />
										{wish.name}
									</Sheet.Title>
									<Sheet.Description>
										Comments can be seen by everyone else except the recipient ({wish.recipient})
									</Sheet.Description>
								</Sheet.Header>

								<Chat
									wishId={wish.id}
									description={null}
									currentUserId={data.user?.id}
									{messages}
									formaction="?/send_comment"
									onsubmit={() => {
										messageActions.getWishComments({ wishId: wish.id }).then((d) => (messages = d));
									}}
								/>
							</Sheet.Content>
						</Sheet.Root>
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
