<script lang="ts">
	import { cn, groupBy } from '$lib/utils.js';
	import BottomDrawer from '$lib/v3/ui/BottomDrawer.svelte';
	import Button from '$lib/v3/ui/Button.svelte';
	import WishListBody from '$lib/v3/WishListBody.svelte';
	import WishListRow from '$lib/v3/WishListRow.svelte';
	import TablerGift from '~icons/tabler/gift';
	import TablerX from '~icons/tabler/x';
	import TablerLoader2 from '~icons/tabler/loader-2';
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import TablerCheck from '~icons/tabler/check';
	import TablerHelp from '~icons/tabler/help';
	import TablerMessage from '~icons/tabler/message';
	import TablerGiftOff from '~icons/tabler/gift-off';
	import { enhance } from '$app/forms';
	import { getChatContext } from '$lib/v2/components/chat/context.svelte.js';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	const groupedByUser = $derived(groupBy(data.wishes, (item) => item.userId));

	const chat = getChatContext();

	let loading = $state<Record<string, boolean>>({});

	let wishOpen = $state(false);
	let wishGiversOpen = $state(false);
	let activeWishId = $state<string | null>(null);
	const active = $derived.by(() => ({
		wish: data.wishes.find((w) => w.id === activeWishId),
		status: data.statuses.find((s) => s.wishId === activeWishId && s.userId == data.user?.id)
	}));
</script>

<svelte:head>
	<title>{m.pagetitle_gift()} - {data.list.name}</title>
</svelte:head>

{#if data.wishes.length > 0}
	<div class="mb-16 flex flex-col gap-8">
		{#each Object.entries(groupedByUser) as [userId, wishes]}
			{@const user = data.list.users.find((u) => u.userId == userId)}

			<div class="flex flex-col">
				<p class="flex items-center gap-1.5 font-medium text-slate-600">
					<TablerGift class="size-5" />
					{m.user_wishes({ user: user?.user.name ?? '' })}
					({wishes.length})
				</p>

				<WishListBody>
					{#each wishes as wish (wish.id)}
						{@const status = data.statuses.find(
							(s) => s.wishId === wish.id && s.userId === data.user?.id
						)}

						<li class="contents">
							<WishListRow
								name={wish.name}
								imageUrl={wish.imageUrl}
								priceCents={wish.priceCents}
								numGivers={wish.numGivers}
								giving={!!status}
								onClick={() => {
									activeWishId = wish.id;
									wishOpen = true;
								}}
							/>
						</li>
					{/each}
				</WishListBody>
			</div>
		{/each}
	</div>
{:else}
	<div class="mx-auto mt-16 flex max-w-56 flex-col items-center text-slate-500">
		<TablerGiftOff class="size-5" />
		<p class="text-md mt-2 text-center font-medium">
			{m.empty_wishes_title()}
		</p>
	</div>
{/if}

<!-- Item drawer -->
<BottomDrawer bind:open={wishOpen} class="w-[450px]">
	<form method="dialog" class="contents">
		<Button class="sticky top-0 gap-1 px-3 py-2 font-medium">
			<TablerX class="size-5" />
			{m.button_title_close()}
		</Button>
	</form>

	{#if active.wish}
		<div class="mt-4 flex flex-col">
			{#if active.wish.imageUrl}
				<img
					src={active.wish.imageUrl}
					alt=""
					loading="lazy"
					class="mb-4 h-48 max-h-48 rounded-xl object-cover"
				/>
			{/if}

			<!-- Basic info -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between leading-tight">
					<p class="font-medium text-slate-500">{active.wish?.username}</p>

					{#if active.wish.priceCents}
						<p class="rounded-full bg-red-100 px-2 py-0 font-medium text-red-600">
							{active.wish.priceCents / 100} €
						</p>
					{/if}
				</div>

				<p class="text-2xl font-semibold leading-tight text-black">{active.wish.name}</p>

				{#if active.wish.description}
					<p class="text-base font-normal leading-tight text-slate-600">
						{active.wish.description}
					</p>
				{/if}
			</div>

			<div class="mt-12 flex flex-col gap-4">
				<button
					class="mx-auto flex items-center gap-1.5 text-slate-500 hover:text-slate-600"
					onclick={() => (wishGiversOpen = true)}
				>
					<!-- Giver circles -->
					<div class="flex items-center">
						{#each { length: Math.min(active.wish.numGivers, 5) }, index}
							<div class="-ml-3 size-[22px] rounded-full border-2 border-white bg-slate-200"></div>
						{:else}
							<TablerX />
						{/each}
					</div>

					<p>{m.wish_givers_amount({ amount: active.wish.numGivers })}</p>
				</button>

				<div class="grid grid-cols-2 gap-4">
					<Button
						onclick={() => active.wish && chat.openComments(active.wish.id, data.list.id)}
						class="w-full justify-center rounded-2xl border border-slate-500 bg-transparent px-3 py-3 font-medium leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-600"
					>
						<TablerMessage class="size-5" />
						{m.button_title_discuss()}
						{active.wish.numComments ? `(${active.wish.numComments})` : ''}
					</Button>
					<Button
						onclick={() => active.wish && chat.openQuestions(active.wish.id, data.list.id)}
						class="w-full justify-center rounded-2xl px-3 py-3 font-medium leading-none"
					>
						<TablerHelp class="size-5" />
						{m.button_title_ask_owner()}
						{active.wish.numQuestions ? `(${active.wish.numQuestions})` : ''}
					</Button>
				</div>

				<form
					method="post"
					action="?/toggle_wish_status"
					class="contents"
					use:enhance={() => {
						loading['toggle'] = true;

						return async ({ update }) => {
							await update();
							loading['toggle'] = false;

							if (active.status) {
								wishOpen = false;
							}
						};
					}}
				>
					<input type="hidden" name="wishId" value={active.wish.id} />

					<Button
						type="submit"
						class={cn(
							'w-full justify-center rounded-2xl border border-transparent bg-green-600 px-8 py-4 text-center text-xl font-semibold leading-tight text-white shadow-md hover:bg-green-700',
							active.status &&
								'border-green-500 bg-transparent text-green-600 shadow-none hover:border-green-600 hover:bg-green-50 hover:text-green-700'
						)}
					>
						{#if loading['toggle']}
							<TablerLoader2 class="flex size-6 animate-spin" />
						{:else if active.status}
							<TablerCheck class="size-6" /> {m.im_giving_this_button()}
						{:else}
							{m.give_this_button()}
						{/if}
					</Button>
				</form>
			</div>
		</div>
	{/if}
</BottomDrawer>

<!-- Givers list -->
<BottomDrawer bind:open={wishGiversOpen} class="w-[450px]">
	<div class="flex items-center gap-3">
		<form method="dialog" class="contents">
			<Button class="sticky top-0 p-2">
				<TablerArrowLeft class="size-6" />
			</Button>
		</form>

		<div class="flex flex-col">
			<p class="text-sm font-semibold leading-tight text-slate-500">
				{m.giving_list_title({ name: active.wish?.username ?? '' })}
			</p>
			<p class="text-xl font-semibold leading-tight text-black">{active.wish?.name}</p>
		</div>
	</div>

	<ul class="mt-8 flex flex-col gap-2">
		{#each { length: active.wish?.numGivers ?? 0 }, index}
			<li class="flex gap-2 font-semibold text-black">
				<div class="size-8 rounded-full bg-slate-200"></div>
				Person {index + 1}
			</li>
		{/each}
	</ul>
</BottomDrawer>
