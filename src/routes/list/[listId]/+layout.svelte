<script lang="ts">
	import WishlistNav from '$lib/components/WishlistNav.svelte';
	import Step from './Step.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<WishlistNav
	wishlistId={data.list.id}
	wishlistName={data.list.name}
	numUsers={data.list.users.length}
/>

<main class="mx-auto flex max-w-2xl flex-col p-4">
	<Step icon="0." text="Start" href="/list/{data.list.id}">
		{@render children()}
	</Step>
	<Step icon="1." text="What do you wish for?" href="/list/{data.list.id}/wish">
		{@render children()}
	</Step>
	<Step
		icon="2."
		text="What would you like to give to others?"
		description="Don't worry, the recipients won't know what you've picked."
		href="/list/{data.list.id}/give"
	>
		{@render children()}
	</Step>
	<Step icon="3." text="Shopping list" href="/list/{data.list.id}/shop" line={false}>
		{@render children()}
	</Step>
</main>
