<script lang="ts">
	import { enhance } from '$app/forms';
	import type { List } from '$lib/server/db/schema';
	import { Button } from '$ui/button';
	import * as Dialog from '$ui/dialog';

	type Props = {
		open: boolean;
		list: List & { users: { userId: string }[] };
		currentUserId: string | undefined;
	};

	let { open = $bindable(), list, currentUserId }: Props = $props();

	let isMember = $derived(list.users.find((u) => u.userId === currentUserId));
</script>

<Dialog.Root bind:open controlledOpen>
	<Dialog.Content interactOutsideBehavior="ignore" class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Join {list.name}</Dialog.Title>
			<Dialog.Description>You must join the wishlist before continuing.</Dialog.Description>
		</Dialog.Header>

		{#if !isMember}
			<form method="post" action="?/join_list" use:enhance class="flex flex-col gap-2">
				<Button type="submit" class="w-full">Join wishlist</Button>
				<Button variant="secondary" href="/">Back</Button>
			</form>
		{:else}
			<form method="post" action="?/leave_list" use:enhance>
				<Button type="submit" variant="destructive" class="w-full">Leave wishlist</Button>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
