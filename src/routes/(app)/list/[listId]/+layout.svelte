<script lang="ts">
	import WishlistNav from './WishlistNav.svelte';
	import ChatSheet from '$lib/v2/components/chat/ChatSheet.svelte';
	import NotificationPermissionDialog from '$lib/v2/components/notifications/NotificationPermissionDialog.svelte';
	import Navigation from '$lib/v3/components/Navigation.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<NotificationPermissionDialog />
<ChatSheet />

{#await data.streamed.unreadQuestions}
	<WishlistNav currentUserId={data.user?.id} list={data.list} users={data.list.users} wishes={[]} />
{:then unreadQuestions}
	<WishlistNav
		currentUserId={data.user?.id}
		list={data.list}
		users={data.list.users}
		wishes={unreadQuestions}
	/>
{/await}

<main class="mx-auto flex w-full gap-8 p-4 sm:mt-8 sm:max-w-6xl">
	<Navigation listId={data.list.id} />

	{@render children()}
</main>
