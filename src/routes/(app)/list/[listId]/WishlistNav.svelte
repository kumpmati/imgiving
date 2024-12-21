<script lang="ts">
	import TablerUsers from '~icons/tabler/users';
	import { Button, buttonVariants } from '$ui/button';
	import type { List, ListUser, WishQuestion } from '$lib/server/db/schema';
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
	import Nav from '$lib/components/Nav.svelte';
	import TablerShare from '~icons/tabler/share';
	import { Input } from '$ui/input';
	import Label from '$ui/label/label.svelte';
	import { page } from '$app/stores';
	import { getToast } from '$lib/components/toasts/context';

	dayjs.extend(relativeTime);

	type Props = {
		currentUserId: string | undefined;
		list: List;
		users: (Pick<ListUser, 'userId' | 'joinedAt'> & { user: { name: string } })[];
		unreadQuestions: (WishQuestion & { wishName: string })[];
	};

	const toast = getToast();
	const actions = superActions<ListEndpoint>('/list');

	let { currentUserId, list, users, unreadQuestions }: Props = $props();

	let joinLink = $derived(`${$page.url.origin}/join/${list.publicShareLink}`);

	let groupedByWish = $derived.by(() => {
		const groups: Record<string, Props['unreadQuestions']> = {};

		unreadQuestions.forEach((q) => {
			groups[q.wishId] ??= [];
			groups[q.wishId].push(q);
		});

		return groups;
	});

	const copyJoinLink = async () => {
		await navigator.clipboard.writeText(joinLink);
		toast.success('Link copied', 'The public share link has been copied to your clipboard.');
	};
</script>

<Nav title={list.name} href="/" titleHref="/list/{list.id}">
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
					There are {users.length} people in {list.name}
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
				onclick={() => actions.leaveList(list.id, { followRedirects: true })}
				disabled={list.authorId === currentUserId}
			>
				Leave wishlist
			</Button>
		</Dialog.Content>
	</Dialog.Root>

	{#if list.authorId === currentUserId}
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
				Share
				<TablerShare class="size-4" />
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Share wishlist</Dialog.Title>
					<Dialog.Description>Invite other users to this wishlist</Dialog.Description>
				</Dialog.Header>

				<div class="flex w-full items-end gap-2">
					<Label class="flex w-full flex-col gap-1">
						Public share link
						<Input
							readonly
							value={joinLink}
							onclick={(e) => {
								e.currentTarget.select();
							}}
						/>
					</Label>
					<Button onclick={copyJoinLink}>Copy</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
</Nav>
