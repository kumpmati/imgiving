<script lang="ts">
	import TablerHelp from '~icons/tabler/help';

	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import ListHeader from '$lib/components/ListHeader.svelte';
	import WishGivers from '$lib/components/wish/WishGivers.svelte';
	import WishForm from '$lib/components/wish/WishForm.svelte';
	import { Button } from '$ui/button';
	import Chat from '$lib/components/chat/Chat.svelte';
	import { Badge } from '$ui/badge';

	let { data } = $props();
</script>

{#if data.isOwner}
	<ListHeader variant="subpage">
		<Button href="/list/{data.list.id}" variant="ghost" size="icon">
			<TablerArrowLeft class="size-4" />
		</Button>

		<p class="text-lg font-semibold">Edit wish</p>

		<Button
			variant={data.numUnreadQuestions > 0 ? 'destructive' : 'outline'}
			size="icon"
			href="/list/{data.list.id}/wish/{data.wish.id}/questions"
		>
			<TablerHelp class="size-4" />
		</Button>
	</ListHeader>

	<main class="mt-8 px-3">
		<form method="post" action="?/edit_wish" class="mx-auto flex max-w-lg flex-col gap-2">
			<WishForm wish={data.wish} />

			<div class="flex flex-col gap-2 sm:flex-row-reverse">
				<Button class="w-full" type="submit">Save changes</Button>
				<Button
					class="w-full"
					type="submit"
					formaction="?/delete_wish"
					variant="destructive"
					onclick={(e) => !confirm('Are you sure?') && e.preventDefault()}>Delete</Button
				>
			</div>
		</form>
	</main>
{:else}
	<ListHeader variant="subpage">
		<Button href="/list/{data.list.id}" variant="ghost" size="icon">
			<TablerArrowLeft class="size-4" />
		</Button>

		<p class="text-lg font-semibold">{data.wish.name}</p>

		{#if data.wish.price}
			<Badge class="h-fit">{data.wish.price}</Badge>
		{/if}
	</ListHeader>

	<main class="mt-3 flex flex-col gap-3 px-3 sm:grid sm:grid-cols-[1fr,auto]">
		<div class="flex flex-col gap-3">
			<section class="flex w-full flex-col gap-1 rounded-md border bg-card p-4">
				<small class="text-sm text-muted-foreground">Description</small>
				<p class="text-base">{data.wish.description || '<no description>'}</p>
			</section>

			<Chat
				description="You can discuss the wish here with others, {data.wish.user
					.name} cannot see these messages."
				currentUserId={data.user?.id}
				messages={data.streamed.comments ?? []}
				formaction="?/send_comment"
			/>
		</div>

		<WishGivers
			class="max-w-sm"
			givers={[
				{ id: 'a', name: 'Dr. Ivo Robotnik', createdAt: new Date() },
				{ id: 'b', name: 'Cheese Gonzales', createdAt: new Date() },
				{ id: 'x', name: 'Lorem Ipsum', createdAt: new Date() },
				{ id: '1', name: 'Dolor at cat', createdAt: new Date() },
				{ id: '2', name: 'Lowly Worm', createdAt: new Date() }
			]}
		/>
	</main>
{/if}
