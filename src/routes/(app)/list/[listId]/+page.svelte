<script lang="ts">
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { toastKey } from '$lib/v2/components/toasts/context';
	import { Toasts } from '$lib/v2/components/toasts/state.svelte';
	import TablerStar from '~icons/tabler/star';
	import TablerGift from '~icons/tabler/gift';
	import TablerPlus from '~icons/tabler/plus';
	import TablerDeviceFloppy from '~icons/tabler/device-floppy';
	import TablerX from '~icons/tabler/x';
	import TablerHelp from '~icons/tabler/help';
	import TablerTrash from '~icons/tabler/trash';
	import Dialog from '$lib/v3/ui/Dialog.svelte';
	import Button from '$lib/v3/ui/Button.svelte';
	import WishFormFields from '$lib/v3/WishFormFields.svelte';
	import WishListRow from '$lib/v3/WishListRow.svelte';
	import WishListBody from '$lib/v3/WishListBody.svelte';
	import { flip } from 'svelte/animate';
	import { getChatContext } from '$lib/v2/components/chat/context.svelte.js';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();

	const chat = getChatContext();

	let newWishOpen = $state(false);

	let editData = $state({
		wishId: null as string | null,
		name: '' as string,
		description: null as string | null,
		imageUrl: null as string | null,
		price: null as number | null
	});
</script>

<svelte:head>
	<title>{m.pagetitle_wish()} - {data.list.name}</title>
</svelte:head>

{#await data.streamed.unreadQuestions then wishesWithQuestions}
	{#if wishesWithQuestions.filter((w) => w.numQuestions > 0).length}
		<div class="flex items-center gap-2 font-medium text-red-600">
			<TablerHelp class="size-5" />
			<p>Questions</p>
		</div>

		<ul class="mb-8 mt-3 flex flex-col gap-2">
			{#each wishesWithQuestions.filter((w) => w.numQuestions > 0) as wish (wish.id)}
				<li class="contents">
					<button
						onclick={() => chat.openQuestions(wish.id, wish.listId)}
						class="flex w-full items-center rounded-2xl bg-red-600 p-4 font-bold text-white"
					>
						{#if wish.imageUrl}
							<img src={wish.imageUrl} loading="lazy" alt="" class="mr-4 size-8 rounded-lg" />
						{/if}

						{wish.name}

						<p class="ml-auto flex items-center gap-1.5">
							{wish.numQuestions}
							<TablerHelp class="size-6" />
						</p>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
{/await}

{#if data.wishes.length == 0}
	<div class="mx-auto mt-16 flex max-w-52 flex-col items-center text-slate-500">
		<TablerGift class="size-6" />
		<p class="mt-2 text-center text-xl font-semibold">You don't have any wishes yet.</p>

		<button
			onclick={() => (newWishOpen = true)}
			class="mx-auto mt-8 flex gap-2 rounded-2xl bg-white px-6 py-2 text-base font-semibold text-black shadow-lg hover:bg-slate-100"
		>
			<TablerPlus class="size-6" />
			{m.add_wish()}
		</button>
	</div>
{:else}
	<div class="flex items-center gap-2 font-medium text-slate-600">
		<TablerStar class="size-5" />
		<p>{m.i_wish_for()}</p>
	</div>

	<WishListBody>
		{#each data.wishes as wish (wish.id)}
			<li class="flex w-full" animate:flip={{ duration: 100 }}>
				<WishListRow
					name={wish.name}
					imageUrl={wish.imageUrl}
					priceCents={wish.priceCents}
					giving={false}
					onClick={() =>
						(editData = {
							wishId: wish.id,
							name: wish.name,
							description: wish.description,
							price: wish.priceCents !== null ? wish.priceCents / 100 : null,
							imageUrl: wish.imageUrl
						})}
				/>
			</li>
		{/each}
	</WishListBody>

	<button
		onclick={() => (newWishOpen = true)}
		class="mx-auto mt-3 flex gap-2 rounded-2xl bg-white px-6 py-2 text-base font-semibold shadow-lg hover:bg-slate-50"
	>
		<TablerPlus class="size-6" />
		{m.add_wish()}
	</button>
{/if}

<!-- Add dialog -->
<Dialog bind:open={newWishOpen} class="w-96">
	<form method="dialog" class="flex items-center gap-3">
		<Button class="p-2">
			<TablerX class="size-6" />
		</Button>
		<p class="text-xl font-semibold">{m.add_wish_title()}</p>
	</form>

	<form
		class="mt-8 flex flex-col gap-4"
		method="post"
		action="?/add_wish"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				newWishOpen = false; // close dialog
			};
		}}
	>
		<WishFormFields name="" description={null} price={null} imageUrl={null} />

		<Button
			type="submit"
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-2 text-white hover:bg-green-700"
		>
			<TablerPlus class="size-6" />
			{m.add_wish()}
		</Button>
	</form>
</Dialog>

<!-- Edit dialog -->
<Dialog open={editData.wishId != null} class="w-96" onClose={() => (editData.wishId = null)}>
	<div class="flex items-center justify-between">
		<form method="dialog" class="flex items-center gap-3">
			<Button class="p-2">
				<TablerX class="size-6" />
			</Button>
			<p class="text-xl font-semibold">{m.edit_wish_title()}</p>
		</form>

		<form
			method="post"
			action="?/delete_wish"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					editData.wishId = null; // close dialog
				};
			}}
		>
			<input type="hidden" name="id" value={editData.wishId} />

			<Button
				type="submit"
				title="Delete wish"
				class="ml-auto bg-red-200 p-2 text-red-600 hover:bg-red-300 hover:text-red-700"
			>
				<TablerTrash class="size-6" />
			</Button>
		</form>
	</div>

	<form
		class="mt-8 flex flex-col gap-4"
		method="post"
		action="?/update_wish"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				editData.wishId = null; // close dialog
			};
		}}
	>
		<input type="hidden" name="wishId" value={editData.wishId} />

		<WishFormFields
			bind:name={editData.name}
			bind:description={editData.description}
			bind:price={editData.price}
			bind:imageUrl={editData.imageUrl}
		/>

		<Button
			type="submit"
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-2 text-white hover:bg-green-700"
		>
			<TablerDeviceFloppy class="size-6" />
			{m.save_changes()}
		</Button>
	</form>
</Dialog>
