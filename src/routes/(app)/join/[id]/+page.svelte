<script lang="ts">
	import { Button, buttonVariants } from '$ui/button';
	import TablerUserPlus from '~icons/tabler/user-plus';
	import TablerGiftFilled from '~icons/tabler/gift-filled';
	import TablerGiftCard from '~icons/tabler/gift-card';
	import TablerArrowRight from '~icons/tabler/arrow-right';
	import * as Card from '$ui/card';
	import Logo from '$lib/components/Logo.svelte';
	import * as Dialog from '$ui/dialog';
	import { cn } from '$lib/utils';
	import SignInForm from '$lib/components/signIn/SignInForm.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { getToast } from '$lib/components/toasts/context.js';
	import Spinner from '$lib/components/Spinner.svelte';

	let { data } = $props();

	const toast = getToast();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Invitation - {data.list.name}</title>
</svelte:head>

<main class="relative flex h-screen overflow-hidden">
	<div class="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2">
		<img
			src="/wave1.svg"
			alt=""
			class="pointer-events-none absolute -left-8 -top-8 z-10 scale-150 select-none"
		/>
		<img
			src="/wave2.svg"
			alt=""
			class="pointer-events-none absolute -bottom-8 -left-8 -z-10 rotate-[15deg] scale-105 select-none"
		/>
		<TablerGiftFilled
			class="pointer-events-none absolute -left-16 bottom-1/2 size-8 -rotate-6 select-none text-red-500"
		/>
		<TablerGiftCard
			class="pointer-events-none absolute -right-1/4 top-2/3 size-6 rotate-3 select-none text-red-300"
		/>

		<Card.Root class="border-dashed border-red-200 shadow-lg">
			<Card.Content class="flex flex-col items-center text-center">
				<Logo title="Giftari" size="sm" />
				<p class="mt-8 text-sm text-muted-foreground">You've been invited to join</p>
				<h1 class="mt-2 text-2xl font-semibold text-primary sm:text-3xl">{data.list.name}</h1>
			</Card.Content>

			<Card.Footer class="mt-4">
				{#if data.member}
					<div class="flex w-full flex-col gap-2 text-center">
						<small class="text-muted-foreground">You have already joined this wishlist</small>
						<Button href="/list/{data.list.id}" class="w-full" variant="secondary">
							Go to wishlist
							<TablerArrowRight class="size-4" />
						</Button>
					</div>
				{:else if data.user}
					<form
						method="post"
						action="?/join"
						class="contents"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
								toast.success('Joined', `Welcome to ${data.list.name}!`);
							};
						}}
					>
						<Button type="submit" class="w-full" disabled={loading}>
							{#if loading}
								<Spinner class="size-4" />
								Joining...
							{:else}
								<TablerUserPlus class="size-4" />
								Join as {data.user.name}
							{/if}
						</Button>
					</form>
				{:else}
					<Dialog.Root>
						<Dialog.Trigger class={cn(buttonVariants(), 'w-full')}>Continue</Dialog.Trigger>

						<Dialog.Content class="max-w-sm">
							<Dialog.Header>
								<Dialog.Title>Create account</Dialog.Title>
								<Dialog.Description>
									You need to create an account before joining this wishlist.
								</Dialog.Description>
							</Dialog.Header>

							<div class="mt-4 flex flex-col gap-4">
								<SignInForm action="?/signup_and_join" backUrl={$page.url.pathname} />
							</div>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			</Card.Footer>
		</Card.Root>
	</div>
</main>
