<script lang="ts">
	import TablerMessage from '~icons/tabler/message';
	import * as Sheet from '$ui/sheet';
	import TablerHelp from '~icons/tabler/help';
	import Chat from './Chat.svelte';
	import { getChatContext } from './context.svelte';
	import Spinner from '../Spinner.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { invalidateAll } from '$app/navigation';
	import { untrack } from 'svelte';

	const ctx = getChatContext();
	const user = getUserContext();

	$effect(() => {
		ctx.current.wish; // run when wish changes

		// IMPORTANT: everything here must be inside untrack,
		// otherwise the invalidation results in an infinite fetch loop!
		untrack(() => {
			if (
				ctx.current.type === 'questions' &&
				ctx.current.wish &&
				ctx.current.wish.userId === user.current?.id
			) {
				ctx
					.markQuestionsAsSeen(ctx.current.wish!.id, ctx.current.wish!.listId)
					.then(() => invalidateAll());
			}
		});
	});
</script>

<Sheet.Root bind:open={ctx.current.open}>
	<Sheet.Content side="right" class="w-[calc(100%-2rem)] sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title class="inline-flex items-center gap-1">
				{#if ctx.current.type === 'questions'}
					<TablerHelp />
				{:else}
					<TablerMessage />
				{/if}
				{ctx.current.wish?.name ?? 'Loading...'}
			</Sheet.Title>
			<Sheet.Description>
				{#if ctx.current.type === 'questions'}
					Questions are anonymous and visible to everyone including the recipient ({ctx.current.wish
						?.user.name ?? '...'}).
				{:else}
					Comments can be seen by everyone else except the recipient ({ctx.current.wish?.user
						.name ?? '...'})
				{/if}
			</Sheet.Description>
		</Sheet.Header>

		{#if ctx.current.loading}
			<Spinner />
		{:else}
			<Chat
				description={null}
				currentUserId={user.current?.id}
				messages={ctx.current.messages}
				onsubmit={(message) => {
					if (!user.current) return;

					if (ctx.current.type === 'questions') {
						ctx.sendQuestion(user.current.id, message).then(() => invalidateAll());
					} else {
						ctx.sendComment(user.current.id, message).then(() => invalidateAll());
					}
				}}
			/>
		{/if}
	</Sheet.Content>
</Sheet.Root>
