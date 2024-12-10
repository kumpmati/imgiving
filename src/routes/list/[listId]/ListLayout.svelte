<script lang="ts">
	import type { Snippet } from 'svelte';
	import Step from './Step.svelte';

	type Steps = 'start' | 'wish' | 'give' | 'shop';

	type Props = {
		step?: Steps;
		start: Snippet;
		wish: Snippet;
		give: Snippet;
		shop: Snippet;
	};

	let { step = $bindable(), start, wish, give, shop }: Props = $props();

	let currentStep = $state<Steps>(step ?? 'start');
</script>

<main class="mx-auto flex max-w-3xl flex-col">
	<Step
		active={currentStep === 'start'}
		icon="0."
		text="Start"
		onclick={() => (currentStep = 'start')}
	>
		{@render start()}
	</Step>
	<Step
		active={currentStep === 'wish'}
		icon="1."
		text="What do you wish for?"
		onclick={() => (currentStep = 'wish')}
	>
		{@render wish()}
	</Step>
	<Step
		active={currentStep === 'give'}
		icon="2."
		text="What would you like to give to others?"
		onclick={() => (currentStep = 'give')}
	>
		{@render give()}
	</Step>
	<Step
		active={currentStep === 'shop'}
		icon="3."
		text="Shopping list"
		onclick={() => (currentStep = 'shop')}
	>
		{@render shop()}
	</Step>
</main>
