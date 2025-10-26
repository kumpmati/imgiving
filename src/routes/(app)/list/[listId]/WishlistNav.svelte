<script lang="ts">
	import type { List, ListUser } from '$lib/server/db/schema';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Nav from '$lib/v2/components/Nav.svelte';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import TablerDotsVertical from '~icons/tabler/dots-vertical';
	import TablerX from '~icons/tabler/x';
	import Dialog from '$lib/v3/ui/Dialog.svelte';
	import Button from '$lib/v3/ui/Button.svelte';
	import { page } from '$app/state';
	import { getToast } from '$lib/v2/components/toasts/context';
	import { superActions } from 'sveltekit-superactions';
	import type { ListEndpoint } from '../+server';

	dayjs.extend(relativeTime);

	type Props = {
		currentUserId: string | undefined;
		list: List;
		users: (Pick<ListUser, 'userId' | 'joinedAt'> & { user: { name: string } })[];
	};

	let { list, users }: Props = $props();

	let dialogOpen = $state(false);
	const joinLink = $derived(`${page.url.origin}/join/${list.publicShareLink}`);
	const actions = superActions<ListEndpoint>('/list');

	const toast = getToast();

	const copyJoinLink = async () => {
		await navigator.clipboard.writeText(joinLink);
		toast.success('Link copied', 'The public share link has been copied to your clipboard.');
	};
</script>

<Nav title={list.name} href="/">
	<button
		onclick={() => (dialogOpen = true)}
		class="flex items-center gap-1.5 rounded-full bg-white p-2 font-medium text-black shadow-lg transition-colors hover:bg-slate-50"
	>
		<TablerDotsVertical class="size-5" />
	</button>
</Nav>

<Dialog bind:open={dialogOpen} class="w-[450px]">
	<div class="mb-4 flex items-center gap-2">
		<form method="dialog" class="contents">
			<Button class="size-9 justify-center p-0">
				<TablerX class="size-5" />
			</Button>
		</form>

		<div class="flex flex-col">
			<p class="text-sm font-semibold leading-tight text-slate-500">Settings</p>
			<h1 class="text-lg font-semibold leading-tight">{list.name}</h1>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<Button
			onclick={() => setLocale(getLocale() === 'en' ? 'fi' : 'en')}
			class="mr-2 px-4 text-slate-500 hover:text-slate-600"
		>
			Language: {getLocale().toUpperCase()}
		</Button>

		<label class="flex flex-col gap-0.5 text-sm font-medium text-slate-500">
			Join link

			<div class="flex items-center gap-1">
				<input
					id="join-link"
					readonly
					value={joinLink}
					class="w-full rounded-xl bg-slate-100 px-4 py-2 text-slate-600"
				/>

				<Button onclick={copyJoinLink}>Copy</Button>
			</div>
		</label>

		<p>Users ({users.length})</p>
		<ul class="flex flex-col gap-2">
			{#each users as user (user.userId)}
				<li>
					{user.user.name}

					{#if list.authorId === user.userId}
						(Owner)
					{/if}
				</li>
			{/each}
		</ul>

		<Button
			onclick={() => actions.leaveList(list.id)}
			class="bg-red-600 px-4 text-white hover:bg-red-700"
		>
			Leave list
		</Button>
	</div>
</Dialog>
