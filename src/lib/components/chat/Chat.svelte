<script lang="ts">
	import TablerSend2 from '~icons/tabler/send-2';
	import Button from '$ui/button/button.svelte';
	import Input from '$ui/input/input.svelte';
	import Message from './Message.svelte';
	import type { ChatMessage } from '$lib/chat';

	type Props = {
		description: string | null;
		currentUserId: string | undefined;
		messages: ChatMessage[];
		onsubmit: (message: string) => Promise<void> | void;
	};

	let { description, currentUserId, messages, onsubmit }: Props = $props();

	let listElement = $state<HTMLUListElement>();
	let newMessage = $state('');

	$effect(() => {
		messages.length; // run scroll effect when messages are added

		if (listElement) {
			listElement.scrollTop = listElement.scrollHeight;
		}
	});
</script>

<div class="flex h-[calc(100%-5rem)] flex-col gap-2">
	<p class="mx-auto mb-5 max-w-64 text-center text-xs text-muted-foreground">{description}</p>

	<ul bind:this={listElement} class="flex h-full flex-col gap-1 overflow-y-auto">
		{#each messages as m, i (m.id)}
			<Message
				isOwn={m.userId === currentUserId}
				sameAuthorAsPrevious={i > 0 && messages[i - 1].userId === m.userId}
				text={m.message}
			/>
		{/each}
	</ul>

	<form
		class="mt-4 flex gap-2"
		onsubmit={async (e) => {
			e.preventDefault();
			await onsubmit(newMessage);
			newMessage = '';
		}}
	>
		<Input
			required
			maxlength={200}
			placeholder="Type your message..."
			class="bg-card"
			bind:value={newMessage}
		/>
		<Button type="submit">
			<TablerSend2 class="size-4" />
		</Button>
	</form>
</div>
