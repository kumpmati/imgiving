<script lang="ts">
	import type { List } from '$lib/server/db/schema';
	import { Button } from '$ui/button';
	import * as Dialog from '$ui/dialog';
	import { superActions } from 'sveltekit-superactions';
	import type { ListEndpoint } from '../+server';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		open: boolean;
		list: List & { users: { userId: string }[] };
		currentUserId: string | undefined;
	};

	const actions = superActions<ListEndpoint>('/list');

	let { open = $bindable(), list, currentUserId }: Props = $props();

	let isMember = $derived(list.users.find((u) => u.userId === currentUserId));
</script>

<Dialog.Root bind:open controlledOpen>
	<Dialog.Content interactOutsideBehavior="ignore" class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Join '{list.name}'</Dialog.Title>
			<Dialog.Description>You must join the wishlist before continuing.</Dialog.Description>
		</Dialog.Header>

		{#if !isMember}
			<div class="flex gap-2">
				<Button variant="secondary" href="/">Back</Button>
				<Button
					class="w-full"
					onclick={() => actions.joinList(list.id).then(() => invalidateAll())}
				>
					Join
				</Button>
			</div>
		{:else}
			<Button variant="destructive" class="w-full" onclick={() => actions.leaveList(list.id)}>
				Leave wishlist
			</Button>
		{/if}
	</Dialog.Content>
</Dialog.Root>
