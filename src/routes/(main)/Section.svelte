<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		textPosition?: 'left' | 'right';
		title: Snippet;
		description: Snippet;
		children?: Snippet;
	};

	let { textPosition = 'left', title, description, children }: Props = $props();
</script>

<div
	class={cn(
		'flex flex-col items-start justify-between gap-8 lg:flex-row',
		textPosition === 'right' && 'lg:flex-row-reverse'
	)}
>
	{@render textContent()}
	{@render children?.()}
</div>

{#snippet textContent()}
	<div class="mt-4 flex w-full max-w-[480px] shrink-0 flex-col gap-4">
		<h3 class="inline-flex items-center gap-2 text-3xl font-semibold">
			{@render title()}
		</h3>
		<p class="text-base text-muted-foreground">
			{@render description()}
		</p>
	</div>
{/snippet}
