<script lang="ts">
	import { page } from '$app/stores';
	import WishlistNav from '$lib/components/WishlistNav.svelte';
	import { Button } from '$ui/button';
	import { fly } from 'svelte/transition';
	import FloatingShoppingList from './FloatingShoppingList.svelte';
	import Step from './Step.svelte';
	import TablerArrowRight from '~icons/tabler/arrow-right';

	let { data, children } = $props();

	const steps = [
		{
			href: `/list/${data.list.id}`,
			label: 'Start'
		},
		{
			href: `/list/${data.list.id}/wish`,
			label: 'I wish for...'
		},
		{
			href: `/list/${data.list.id}/give`,
			label: 'I want to give...',
			description: "The recipients won't know what you've picked."
		},
		{
			href: `/list/${data.list.id}/shop`,
			label: 'Shopping list',
			description: "Keep track of what you're buying."
		}
	];

	const stepButtonLabels = [
		[null, 'Start'],
		['Back to start', 'Choose gifts for others'],
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

<WishlistNav
	wishlistId={data.list.id}
	wishlistName={data.list.name}
	numUsers={data.list.users.length}
/>

<main class="mx-auto flex w-full gap-8 p-4 sm:max-w-6xl">
	<section class="flex w-full flex-col sm:max-w-2xl">
		{#each steps as step, i (step.href)}
			<Step
				icon="{i}."
				text={step.label}
				href={step.href}
				description={step.description}
				line={i < steps.length}
			>
				{@render children()}
			</Step>
		{/each}
	</section>

	<div class="fixed bottom-4 left-0 flex w-full gap-2 px-4 sm:hidden">
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

	{#if currentStepIndex > 1}
		<section
			class="sticky top-8 ml-auto mt-16 hidden h-fit w-80 flex-col gap-8 lg:flex"
			transition:fly={{ x: 5, duration: 250 }}
		>
			<FloatingShoppingList
				users={data.list.users.filter((u) => u.userId !== data.user?.id).length}
				items={data.buylist}
			/>
		</section>
	{/if}
</main>
