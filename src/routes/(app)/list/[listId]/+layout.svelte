<script lang="ts">
	import TablerLoader2 from '~icons/tabler/loader-2';
	import WishlistNav from './WishlistNav.svelte';
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import NotificationPermissionDialog from '$lib/v2/components/notifications/NotificationPermissionDialog.svelte';
	import Navigation from '$lib/v3/ui/Navigation.svelte';
	import { getChatContext } from '$lib/v3/chat/context.svelte';
	import BottomDrawer from '$lib/v3/ui/BottomDrawer.svelte';
	import Button from '$lib/v3/ui/Button.svelte';
	import Alert from '$lib/v3/Alert.svelte';
	import Chat from '$lib/v3/chat/Chat.svelte';
	import { invalidateAll } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';

	let { data, children } = $props();

	const chat = getChatContext();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<NotificationPermissionDialog />
<WishlistNav currentUserId={data.user?.id} list={data.list} users={data.list.users} />

<main class="mx-auto flex w-full max-w-xl flex-col p-4">
	<Navigation listId={data.list.id} />

	{@render children()}
</main>

<BottomDrawer bind:open={chat.current.open} class="w-[450px]">
	<div class="mb-4 flex items-center gap-2">
		<form method="dialog" class="contents">
			<Button class="size-9 p-2">
				<TablerArrowLeft class="size-5" />
			</Button>
		</form>

		<div class="flex flex-col">
			<p class="text-sm font-semibold leading-tight text-slate-500">
				{#if chat.current.type === 'questions'}
					{m.ask_owner()}
				{:else}
					{m.discuss()}
				{/if}
			</p>
			<p class="text-lg font-semibold leading-tight text-black">
				{#if chat.current.loading}
					{m.loading()}
				{:else}
					{chat.current.wish?.name}
				{/if}
			</p>
		</div>
	</div>

	{#if !chat.current.loading}
		{#if chat.current.type === 'comments'}
			<Alert type="warning">
				{m.discussion_warning({ name: chat.current.wish?.user.name ?? '' })}
			</Alert>
		{:else}
			<Alert type="error">
				{m.question_warning({ name: chat.current.wish?.user.name ?? '' })}
			</Alert>
		{/if}

		<Chat
			class="mt-8"
			wishOwnerId={chat.current.wish?.userId}
			currentUserId={data.user?.id}
			messages={chat.current.messages}
			onsubmit={(message) => {
				if (!data.user) return;

				if (chat.current.type === 'questions') {
					chat.sendQuestion(data.user.id, message).then(() => invalidateAll());
				} else {
					chat.sendComment(data.user.id, message).then(() => invalidateAll());
				}
			}}
		/>
	{:else}
		<TablerLoader2 class="mx-auto my-4 size-8 animate-spin text-slate-500" />
	{/if}
</BottomDrawer>

<style>
	:global(body) {
		background: rgb(248 250 252 / var(--tw-bg-opacity, 1)); /* bg-slate-50 */
	}
</style>
