<script>
	import { cn } from '$lib/utils';
	import { Button, buttonVariants } from '$ui/button';
	import * as Card from '$ui/card';
	import * as Dialog from '$ui/dialog';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import TablerUsers from '~icons/tabler/users';
	import TablerTrash from '~icons/tabler/trash';
	import { enhance } from '$app/forms';
	import * as Alert from '$ui/alert';
	import TablerAlertCircle from '~icons/tabler/alert-circle';
	import TablerCheck from '~icons/tabler/check';
	import TablerBrandGoogleFilled from '~icons/tabler/brand-google-filled';
	import { Badge } from '$ui/badge';

	dayjs.extend(relativeTime);

	let { data } = $props();
</script>

<svelte:head>
	<title>My account</title>
</svelte:head>

<main class="mx-auto flex w-full max-w-xl flex-col gap-4 p-2 sm:p-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>{data.user?.name}</Card.Title>
			<Card.Description>
				Joined <span>{dayjs(data.user?.createdAt).fromNow()}</span>
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col">
			{#if !data.user?.verifiedAt}
				<Alert.Root variant="destructive" class="mb-4">
					<TablerAlertCircle class="size-4" />
					<Alert.Title>Unverified account</Alert.Title>
					<Alert.Description>
						Your account will be automatically deleted {dayjs(data.user?.createdAt)
							.add(30, 'days')
							.fromNow()} unless you add a sign-in method.
					</Alert.Description>
				</Alert.Root>
			{/if}

			<p class="mb-2 text-muted-foreground">Sign-in methods</p>

			<div class="flex items-center gap-2">
				<Button
					href="/auth/google/signin?back=/account"
					data-sveltekit-preload-data="off"
					class="w-fit"
					variant="outline"
				>
					<TablerBrandGoogleFilled class="size-4" /> Google
				</Button>

				{#if data.user?.googleId}
					<Badge class="gap-1 bg-green-600">
						<TablerCheck class="size-4" />
						Connected
					</Badge>
				{:else}
					<p class="text-sm text-muted-foreground">Not connected</p>
				{/if}
			</div>

			{#if !data.user?.googleId}
				<Dialog.Root>
					<Dialog.Trigger class={cn(buttonVariants({ variant: 'destructive' }), 'mt-8 w-fit')}>
						Sign Out
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Are you sure?</Dialog.Title>
							<Dialog.Description>
								You haven't added any sign-in methods to this account, and could lose all access to
								your data.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Cancel</Dialog.Close>
							<Button data-sveltekit-preload-data="off" href="/auth/signout" variant="destructive">
								Sign out
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Button
					data-sveltekit-preload-data="off"
					href="/auth/signout"
					variant="destructive"
					class="mt-8 w-fit"
				>
					Sign out
				</Button>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>My wishlists ({data.wishlists.length})</Card.Title>
		</Card.Header>
		<Card.Content>
			<ul class="flex flex-col gap-2">
				{#each data.wishlists as list (list.id)}
					<li
						class="flex items-center justify-between rounded px-2 py-1 transition-colors hover:bg-slate-100"
					>
						<a href="/list/{list.id}" class="flex flex-col">
							{list.name}
							<span class="flex items-center gap-2 text-xs text-muted-foreground">
								<span class="inline-flex items-center gap-1">
									<TablerUsers class="size-4" />
									{list.users.length}
								</span>

								-

								<span>Created {dayjs(list.createdAt).fromNow()}</span>
							</span>
						</a>

						<Dialog.Root>
							<Dialog.Trigger class={buttonVariants({ size: 'icon', variant: 'ghost' })}>
								<TablerTrash class="size-4" />
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Are you sure?</Dialog.Title>
									<Dialog.Description>
										You are about to permanently delete {list.name} and all its associated data. This
										cannot be undone.
									</Dialog.Description>
								</Dialog.Header>

								<Dialog.Footer>
									<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
									<form method="post" action="?/delete_list" use:enhance>
										<input type="hidden" name="id" value={list.id} />
										<Button type="submit" variant="destructive">Delete</Button>
									</form>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</li>
				{:else}
					<li class="text-sm text-muted-foreground">You don't have any wishlists yet.</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
</main>
