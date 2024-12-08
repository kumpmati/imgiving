<script lang="ts">
	import { enhance } from '$app/forms';
	import ListHeader from '$lib/components/ListHeader.svelte';
	import ListLogo from '$lib/components/ListLogo.svelte';
	import WishCard from '$lib/components/wish/WishCard.svelte';
	import WishForm from '$lib/components/wish/WishForm.svelte';
	import Button, { buttonVariants } from '$ui/button/button.svelte';
	import * as Dialog from '$ui/dialog';
	import * as Tabs from '$ui/tabs';
	import TablerPlus from '~icons/tabler/plus';
	import TablerUsers from '~icons/tabler/users';

	let { data } = $props();

	// TODO: save tab in url (hash / query param)
	let tab = $state<'all'>('all');

	let showAddDialog = $state(false);
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<ListHeader variant="home">
	<ListLogo href="/list/{data.list.id}" name={data.list.name} />

	<nav class="flex gap-2">
		{#if !data.list.users.find((u) => u.userId === data.user?.id)}
			<form method="post" use:enhance action="?/join" class="contents">
				<Button type="submit">Join wishlist</Button>
			</form>
		{:else}
			<Button
				size="icon"
				variant="outline"
				class="w-auto px-2"
				href="/list/{data.list.id}/invite"
				title="Invite users"
			>
				{data.list.users.length}
				<TablerUsers width={16} height={16} />
			</Button>
		{/if}
	</nav>
</ListHeader>

<main class="grid grid-cols-[auto,1fr] gap-4 p-3">
	<section class="flex min-w-80 max-w-sm flex-col rounded-lg p-4">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">My wishes ({data.ownWishes.length})</h2>
			<Dialog.Root bind:open={showAddDialog}>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
					<TablerPlus width={16} height={16} />
				</Dialog.Trigger>

				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Add wish</Dialog.Title>
						<Dialog.Description>
							Other members will be able to see and interact with the wish.
						</Dialog.Description>
					</Dialog.Header>

					<form
						method="post"
						action="?/add_wish"
						use:enhance={() => {
							return ({ update }) => {
								update();
								showAddDialog = false;
							};
						}}
						class="flex flex-col gap-4"
					>
						<WishForm />

						<Dialog.Footer>
							<Button type="submit">
								Add wish
								<TablerPlus class="size-4" />
							</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<ul class="flex flex-col gap-2">
			{#each data.ownWishes as wish (wish.id)}
				<li>
					<WishCard
						href="/list/{data.list.id}/wish/{wish.id}"
						name={wish.name}
						price={wish.price}
						unreadQuestions={wish.numUnreadQuestions}
					/>
				</li>
			{/each}
		</ul>
	</section>
	<section class="flex flex-col rounded-xl border bg-card p-4">
		<Tabs.Root bind:value={tab}>
			<Tabs.List>
				<Tabs.Trigger value="all">All wishes</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="all">
				{#await data.streamed.allWishes then allWishes}
					<ul class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
						{#each allWishes as wish (wish.id)}
							<li>
								<WishCard
									href="/list/{data.list.id}/wish/{wish.id}"
									recipient={wish.user.name}
									name={wish.name}
									price={wish.price}
									class="h-full"
								/>
							</li>
						{:else}
							<div class="grid h-full place-content-center">
								<p class="text-muted-foreground">No wishes found.</p>
							</div>
						{/each}
					</ul>
				{:catch err}
					<p>Something went wrong</p>
				{/await}
			</Tabs.Content>
		</Tabs.Root>
	</section>
</main>
