<script lang="ts">
	import TablerUsers from '~icons/tabler/users';
	import { Button, buttonVariants } from '$ui/button';
	import Logo from '$lib/components/Logo.svelte';
	import type { ListUser, WishQuestion } from '$lib/server/db/schema';
	import TablerBell from '~icons/tabler/bell';
	import TablerBellRingingFilled from '~icons/tabler/bell-ringing-filled';
	import { cn } from '$lib/utils';
	import * as Dialog from '$ui/dialog';
	import Message from '$lib/components/chat/Message.svelte';
	import * as Table from '$ui/table';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { superActions } from 'sveltekit-superactions';
	import type { ListEndpoint } from '../+server';

	dayjs.extend(relativeTime);

	type Props = {
		currentUserId: string | undefined;
		wishlistAuthorId: string;
		wishlistName: string;
		wishlistId: string;
		users: (Pick<ListUser, 'userId' | 'joinedAt'> & { user: { name: string } })[];
		unreadQuestions: (WishQuestion & { wishName: string })[];
	};

	const actions = superActions<ListEndpoint>('/list');

	let { currentUserId, wishlistAuthorId, wishlistId, wishlistName, users, unreadQuestions }: Props =
		$props();

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
									{#each questions as q (q.id)}
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

		<Dialog.Root>
			<Dialog.Trigger
				class={cn(buttonVariants({ variant: 'outline' }), 'gap-1 px-2')}
				title="{users} members"
			>
				{users.length}
				<TablerUsers />
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Members</Dialog.Title>
					<Dialog.Description>
						There are {users.length} people in {wishlistName}
					</Dialog.Description>
				</Dialog.Header>

				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head class="w-32">Joined</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each users as user (user.userId)}
							<Table.Row>
								<Table.Cell>
									{user.user.name}

									{#if user.userId === currentUserId}
										<span class="text-muted-foreground">(You)</span>
									{/if}
								</Table.Cell>
								<Table.Cell>{dayjs(user.joinedAt).fromNow()}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>

				<Button
					variant="destructive"
					onclick={() => actions.leaveList(wishlistId, { followRedirects: true })}
					disabled={wishlistAuthorId === currentUserId}
				>
					Leave wishlist
				</Button>
			</Dialog.Content>
		</Dialog.Root>
	</nav>
</header>
