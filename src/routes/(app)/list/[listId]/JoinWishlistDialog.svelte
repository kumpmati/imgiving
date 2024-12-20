<script lang="ts">
	import type { List } from '$lib/server/db/schema';
	import { Button } from '$ui/button';
	import * as Dialog from '$ui/dialog';
	import { superActions } from 'sveltekit-superactions';
	import type { ListEndpoint } from '../+server';
	import { invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import { Toasts } from '$lib/components/toasts/state.svelte';
	import { toastKey } from '$lib/components/toasts/context';

	type Props = {
		open: boolean;
		list: List & { users: { userId: string }[] };
	};

	const actions = superActions<ListEndpoint>('/list');
	const t = getContext<Toasts>(toastKey);

	let { open = $bindable(), list }: Props = $props();
</script>

<Dialog.Root bind:open controlledOpen>
	<Dialog.Content interactOutsideBehavior="ignore" class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Join '{list.name}'</Dialog.Title>
			<Dialog.Description>You must join the wishlist before continuing.</Dialog.Description>
		</Dialog.Header>

		<div class="flex gap-2">
			<Button variant="secondary" href="/">Back</Button>
			<Button
				class="w-full"
				onclick={() =>
					actions
						.joinList(list.id)
						.then(() => invalidateAll())
						.then(() => t.success(`Welcome to ${list.name}!`))}
			>
				Join
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
