<script lang="ts">
	import { page } from '$app/stores';
	import WishlistNav from './WishlistNav.svelte';
	import { Button } from '$ui/button';
	import { fly } from 'svelte/transition';
	import FloatingShoppingList from './FloatingShoppingList.svelte';
	import Step from './Step.svelte';
	import TablerArrowRight from '~icons/tabler/arrow-right';
	import ChatSheet from '$lib/v2/components/chat/ChatSheet.svelte';
	import { getNotificationContext } from '$lib/v2/components/notifications/context.svelte';
	import NotificationPermissionDialog from '$lib/v2/components/notifications/NotificationPermissionDialog.svelte';

	let { data, children } = $props();

	const steps = [
		{
			href: `/list/${data.list.id}`,
			label: 'I wish for ...'
		},
		{
			href: `/list/${data.list.id}/give`,
			label: "I'm going to give ...",
			description: "(The recipients won't know what you've picked)"
		},
		{
			href: `/list/${data.list.id}/shop`,
			label: 'Shopping list',
			description: "Keep track of what you're buying."
		}
	];

	const stepButtonLabels = [
		[null, 'Choose gifts for others'],
		['Back to my gifts', 'Shopping list'],
		["Back to others' gifts", null]
	];

	let currentStepIndex = $derived(steps.findIndex((s) => s.href === $page.url.pathname));
	let nextStep = $derived(steps.at(currentStepIndex + 1));
	let previousStep = $derived(steps.at(currentStepIndex - 1));
	let buttonLabels = $derived(stepButtonLabels[currentStepIndex]);
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<NotificationPermissionDialog />
<ChatSheet />

{#await data.streamed.unreadQuestions}
	<WishlistNav currentUserId={data.user?.id} list={data.list} users={data.list.users} wishes={[]} />
{:then unreadQuestions}
	<WishlistNav
		currentUserId={data.user?.id}
		list={data.list}
		users={data.list.users}
		wishes={unreadQuestions}
	/>
{/await}

<main class="mx-auto flex w-full gap-8 p-4 sm:mt-8 sm:max-w-6xl">
	<section class="flex w-full flex-col sm:max-w-2xl">
		{#each steps as step, i (step.href)}
			<Step
				icon="{i + 1}."
				text={step.label}
				href={step.href}
				description={step.description}
				line={i < steps.length}
			>
				{@render children()}
			</Step>
		{/each}
	</section>

	<div
		class="fixed bottom-0 left-0 grid w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 bg-background px-4 pb-4 sm:hidden"
	>
		{#if previousStep && buttonLabels[0]}
			<Button variant="secondary" href={previousStep.href} class="w-full">{buttonLabels[0]}</Button>
		{/if}
		{#if nextStep && buttonLabels[1]}
			<Button href={nextStep.href} class="w-full">
				{buttonLabels[1]}
				<TablerArrowRight />
			</Button>
		{/if}
	</div>

	{#if currentStepIndex > 0}
		<section
			class="sticky top-16 ml-auto mt-16 hidden h-fit w-80 flex-col gap-8 lg:flex"
			transition:fly={{ x: 5, duration: 250 }}
		>
			<FloatingShoppingList
				users={data.list.users.filter((u) => u.userId !== data.user?.id).length}
				items={data.buylist}
			/>
		</section>
	{/if}
</main>
