<script lang="ts">
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import Chat from '$lib/components/chat/Chat.svelte';
	import ListHeader from '$lib/components/ListHeader.svelte';
	import Button from '$ui/button/button.svelte';
	import { superActions } from 'sveltekit-superactions';
	import { page } from '$app/stores';
	import type { QuestionEndpoint } from './+server.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const actions = superActions<QuestionEndpoint>($page.url.pathname);

	onMount(() => {
		actions.markAsRead();
	});
</script>

<ListHeader variant="subpage">
	<!-- TODO: use a proper dynamic backlink -->
	<Button href="/list/{data.list.id}/wish/{data.wish.id}" variant="ghost" size="icon">
		<TablerArrowLeft class="size-4" />
	</Button>

	<h1 class="text-xl font-semibold">Questions</h1>

	<div></div>
</ListHeader>

<div class="mx-auto mt-4 max-w-lg border border-slate-500 p-4">
	<Chat
		description="Everyone in the list can access this chat, but the messages are anonymous to you."
		currentUserId={data.user?.id}
		messages={data.streamed.questions}
		formaction="?/send_question"
	/>
</div>
