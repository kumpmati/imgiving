<script lang="ts">
	import type { List, ListUser, Wish } from '$lib/server/db/schema';
	import TablerUsers from '~icons/tabler/users';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Nav from '$lib/v2/components/Nav.svelte';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';

	dayjs.extend(relativeTime);

	type Props = {
		currentUserId: string | undefined;
		list: List;
		users: (Pick<ListUser, 'userId' | 'joinedAt'> & { user: { name: string } })[];
		wishes: (Wish & { numQuestions: number })[];
	};

	let { list, users }: Props = $props();

	// let joinLink = $derived(`${page.url.origin}/join/${list.publicShareLink}`);

	// const copyJoinLink = async () => {
	// 	await navigator.clipboard.writeText(joinLink);
	// 	toast.success('Link copied', 'The public share link has been copied to your clipboard.');
	// };
</script>

<Nav title={list.name} href="/">
	<button
		onclick={() => setLocale(getLocale() === 'en' ? 'fi' : 'en')}
		class="mr-2 text-slate-500 hover:text-slate-600"
	>
		{getLocale().toUpperCase()}
	</button>

	<button
		class="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-medium text-black shadow-lg transition-colors hover:bg-slate-50"
	>
		<TablerUsers class="size-5" />
		{users.length}
	</button>
</Nav>
