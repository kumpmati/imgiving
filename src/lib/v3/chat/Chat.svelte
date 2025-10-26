<script lang="ts">
	import TablerSend2 from '~icons/tabler/send-2';
	import Message from './Message.svelte';
	import type { ChatMessage } from '$lib/chat';
	import { cn } from '$lib/utils';

	type Props = {
		currentUserId: string | undefined;
		wishOwnerId: string | undefined;
		messages: ChatMessage[];
		onsubmit: (message: string) => Promise<void> | void;
		class?: string;
	};

	let { currentUserId, wishOwnerId, messages, onsubmit, class: classes }: Props = $props();

	let listElement = $state<HTMLUListElement>();
	let newMessage = $state('');

	$effect(() => {
		messages.length; // run scroll effect when messages are added

		if (listElement) {
			listElement.scrollTop = listElement.scrollHeight;
		}
	});
</script>

<div class={cn('flex h-[calc(100%-5rem)] flex-col gap-2', classes)}>
	<ul bind:this={listElement} class="flex h-full flex-col gap-2 overflow-y-auto">
		{#each messages as m, i (m.id)}
			<Message
				isOwn={m.userId === currentUserId}
				isOwner={m.userId === wishOwnerId}
				username={currentUserId === wishOwnerId ? 'Anonymous' : (m.user?.name ?? 'Anonymous')}
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
		<div class="flex w-full rounded-xl border border-slate-300 focus-within:border-slate-600">
			<input
				required
				name="message"
				type="text"
				maxlength={300}
				placeholder="Type your message..."
				class="w-full bg-transparent px-3 py-2 text-base placeholder-slate-400 focus-visible:outline-none"
				bind:value={newMessage}
			/>
			<button type="submit" class="px-3 py-2 text-slate-600 hover:text-slate-500">
				<TablerSend2 class="size-6" />
			</button>
		</div>
	</form>
</div>
