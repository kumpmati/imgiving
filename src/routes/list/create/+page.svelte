<script lang="ts">
	import TablerPlus from '~icons/tabler/plus';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import Input from '$ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import { toastKey } from '$lib/components/toasts/context.js';
	import { getContext } from 'svelte';
	import { Toasts } from '$lib/components/toasts/state.svelte.js';

	let { data } = $props();

	const t = getContext<Toasts>(toastKey);
</script>

<svelte:head>
	<title>Giftari - Gift coordination made easy</title>
</svelte:head>

<main
	class="absolute left-1/2 top-1/2 mx-auto flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 p-4"
>
	{#if data.user}
		<p class="text-sm text-muted-foreground">
			Signed in as <span class="font-semibold text-primary">{data.user.name}</span>
		</p>
	{:else}
		<Button href="/auth/signin" variant="outline">Sign In</Button>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title>Create wishlist</Card.Title>
			<Card.Description>
				In order to coordinate gifts, you need to create a wishlist.
			</Card.Description>
		</Card.Header>
		<form
			method="post"
			class="contents"
			use:enhance={() => {
				return async ({ update }) => {
					update().then(() => t.success('Wishlist created'));
				};
			}}
		>
			<Card.Content>
				<Input type="text" name="name" required placeholder="Wishlist name" />
			</Card.Content>
			<Card.Footer>
				<Button type="submit" class="w-full">
					Create list
					<TablerPlus />
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>
