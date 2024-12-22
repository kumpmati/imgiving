<script lang="ts">
	import TablerUsers from '~icons/tabler/users';
	import { Button, buttonVariants } from '$ui/button';
	import type { List, ListUser, Wish } from '$lib/server/db/schema';
	import TablerBell from '~icons/tabler/bell';
	import TablerBellRingingFilled from '~icons/tabler/bell-ringing-filled';
	import { cn } from '$lib/utils';
	import * as Dialog from '$ui/dialog';
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
	import { getChatContext } from '$lib/components/chat/context.svelte';
	import TablerMessageCircle from '~icons/tabler/message-circle';
	import { sum } from '$lib/math';
	import { getNotificationContext } from '$lib/components/notifications/context.svelte';
	import { Badge } from '$ui/badge';

	dayjs.extend(relativeTime);

	type Props = {
		currentUserId: string | undefined;
		list: List;
		users: (Pick<ListUser, 'userId' | 'joinedAt'> & { user: { name: string } })[];
		wishes: (Wish & { numQuestions: number })[];
	};

	const notifications = getNotificationContext();
	const chat = getChatContext();
	const toast = getToast();
	const actions = superActions<ListEndpoint>('/list');

	let { currentUserId, list, users, wishes }: Props = $props();

	let updateSwLoading = $state(false);

	let joinLink = $derived(`${$page.url.origin}/join/${list.publicShareLink}`);

	let notificationsOpen = $state(false);
	let numUnreadQuestions = $derived(sum(wishes.map((q) => q.numQuestions)));

	const copyJoinLink = async () => {
		await navigator.clipboard.writeText(joinLink);
		toast.success('Link copied', 'The public share link has been copied to your clipboard.');
	};
</script>

<Nav title={list.name} href="/" titleHref="/list/{list.id}">
	<Dialog.Root bind:open={notificationsOpen}>
		<Dialog.Trigger
			class={cn(
				buttonVariants({ variant: numUnreadQuestions > 0 ? 'destructive' : 'outline' }),
				'gap-1 px-2',
				numUnreadQuestions > 0 && 'px-3'
			)}
		>
			{numUnreadQuestions || ''}

			{#if numUnreadQuestions > 0}
				<TablerBellRingingFilled />
			{:else}
				<TablerBell />
			{/if}
		</Dialog.Trigger>

		<Dialog.Content class="max-w-sm">
			<Dialog.Header>
				<Dialog.Title>Notifications</Dialog.Title>
				<Dialog.Description>Any questions on your wishes will appear here.</Dialog.Description>
			</Dialog.Header>

			<Table.Root>
				<Table.Body>
					{#each wishes as wish (wish.id)}
						{@const hasUnread = wish.numQuestions > 0}
						<Table.Row class={hasUnread ? 'hover:bg-red-50' : ''}>
							<Table.Cell class={cn('text-base font-medium', hasUnread && 'text-red-600')}>
								{wish.name}
							</Table.Cell>
							<Table.Cell class="w-0 text-right">
								<Button
									onclick={() => {
										chat.openQuestions(wish.id, wish.listId);
										notificationsOpen = false;
									}}
									variant={hasUnread ? 'destructive' : 'outline'}
									class="px-2"
								>
									{wish.numQuestions || ''}
									<TablerMessageCircle class="size-4" />
								</Button>
							</Table.Cell>
						</Table.Row>
					{:else}
						<p class="text-muted-foreground">You don't have any wishes yet.</p>
					{/each}
				</Table.Body>
			</Table.Root>

			<p class="mt-4 font-semibold">Settings</p>
			<Badge
				variant={notifications.allowed ? 'default' : 'destructive'}
				class={cn('w-fit', notifications.allowed && 'bg-green-600')}
			>
				Notifications {notifications.allowed ? 'enabled' : 'disabled'}
			</Badge>

			<Button
				onclick={async () => {
					updateSwLoading = true;
					await notifications.updateRegistration();
					toast.success('Updated');
					updateSwLoading = false;
				}}
				disabled={updateSwLoading}
			>
				{#if updateSwLoading}
					Updating...
				{:else}
					Update service worker
				{/if}
			</Button>
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
			<Dialog.Trigger class={buttonVariants()}>
				Share
				<TablerShare class="size-4" />
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Share wishlist</Dialog.Title>
					<Dialog.Description
						>Invite other users to this wishlist by giving them this link.</Dialog.Description
					>
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
