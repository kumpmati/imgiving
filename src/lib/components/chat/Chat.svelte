<script lang="ts">
	import TablerSend2 from '~icons/tabler/send-2';
	import { enhance } from '$app/forms';
	import Button from '$ui/button/button.svelte';
	import Input from '$ui/input/input.svelte';
	import Message from './Message.svelte';

	type ChatMessage = {
		id: string;
		message: string;
		userId: string;
		createdAt: Date;
	};

	type Props = {
		description: string | null;
		currentUserId: string | undefined;
		messages: ChatMessage[] | Promise<ChatMessage[]>;
		formaction: string;
		hideMessageInput?: boolean;
	};

	let { description, formaction, currentUserId, messages, hideMessageInput }: Props = $props();
</script>

<div class="flex h-full flex-col gap-2">
	<p class="mx-auto mb-5 max-w-64 text-center text-xs text-muted-foreground">{description}</p>

	<ul class="flex h-full flex-col gap-1">
		{#await messages}
			<p>Loading...</p>
		{:then loadedMessages}
			{#each loadedMessages as m, i (m.id)}
				<Message
					isOwn={m.userId === currentUserId}
					sameAuthorAsPrevious={i > 0 && loadedMessages[i - 1].userId === m.userId}
					text={m.message}
				/>
			{/each}
		{/await}
	</ul>

	{#if !hideMessageInput}
		<form class="mt-4 flex gap-2" method="post" action={formaction} use:enhance>
			<Input
				required
				name="message"
				maxlength={200}
				placeholder="Type your message..."
				class="bg-card"
			/>
			<Button type="submit">
				<TablerSend2 class="size-4" />
			</Button>
		</form>
	{/if}
</div>
