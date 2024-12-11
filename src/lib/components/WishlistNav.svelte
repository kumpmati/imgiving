<script lang="ts">
	import TablerUsers from '~icons/tabler/users';
	import { Button, buttonVariants } from '$ui/button';
	import Logo from './Logo.svelte';
	import type { WishQuestion } from '$lib/server/db/schema';
	import TablerBell from '~icons/tabler/bell';
	import TablerBellRingingFilled from '~icons/tabler/bell-ringing-filled';
	import { cn } from '$lib/utils';
	import * as Dialog from '$ui/dialog';
	import Message from './chat/Message.svelte';

	type Props = {
		wishlistName: string;
		wishlistId: string;
		numUsers: number;
		unreadQuestions: (WishQuestion & { wishName: string })[];
	};

	let { wishlistId, wishlistName, numUsers, unreadQuestions }: Props = $props();

	let groupedByWish = $derived.by(() => {
		const groups: Record<string, Props['unreadQuestions']> = {};

		unreadQuestions.forEach((q) => {
			groups[q.wishId] ??= [];
			groups[q.wishId].push(q);
		});

		return groups;
	});
</script>

<header class="z-10 flex items-center justify-between p-4 sm:sticky sm:top-0">
	<Logo href="/list/{wishlistId}" />

	<nav class="flex items-center gap-2">
		<p class="text-sm leading-none">{wishlistName}</p>

		<Dialog.Root>
			<Dialog.Trigger
				class={cn(
					buttonVariants({ variant: unreadQuestions.length > 0 ? 'destructive' : 'outline' }),
					'gap-1 px-2',
					unreadQuestions.length > 0 && 'px-3'
				)}
			>
				{unreadQuestions.length || ''}

				{#if unreadQuestions.length > 0}
					<TablerBellRingingFilled />
				{:else}
					<TablerBell />
				{/if}
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Unread messages</Dialog.Title>
					<Dialog.Description>Any questions on your wishes will appear here.</Dialog.Description>
				</Dialog.Header>

				<ul class="flex flex-col gap-4">
					{#each Object.entries(groupedByWish) as [wishId, questions] (wishId)}
						<li>
							<div class="flex flex-col">
								<p class="text-lg font-semibold">{questions[0].wishName}</p>

								<ul class="ml-2 flex flex-col gap-2">
									{#each questions as q, i (q.id)}
										<li>
											<Message isOwn={false} sameAuthorAsPrevious text={q.message} />
										</li>
									{/each}
								</ul>
							</div>
						</li>
					{:else}
						<p class="text-muted-foreground">All caught up!</p>
					{/each}
				</ul>
			</Dialog.Content>
		</Dialog.Root>

		<Button
			variant="outline"
			href="/list/{wishlistId}/invite"
			class="gap-1 px-2"
			title="{numUsers} members"
		>
			{numUsers}
			<TablerUsers />
		</Button>
	</nav>
</header>
