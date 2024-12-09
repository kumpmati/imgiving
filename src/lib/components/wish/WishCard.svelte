<script lang="ts">
	import TablerCircleDashed from '~icons/tabler/circle-dashed';
	import TablerCircleCheck from '~icons/tabler/circle-check';
	import TablerMessage from '~icons/tabler/message';
	import TablerHelp from '~icons/tabler/help';
	import { cn } from '$lib/utils';
	import { Badge } from '$ui/badge';
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		name: string;
		price: string | null;
		recipient?: string;

		questions?: number;
		unreadQuestions?: number;
		comments?: number;
		numGivers?: number;

		children?: Snippet;

		class?: string;
	};

	let {
		href,
		recipient,
		name,
		price,
		questions,
		unreadQuestions,
		comments,
		numGivers,
		children,
		class: className
	}: Props = $props();
</script>

<a
	{href}
	class={cn(
		'relative flex flex-col rounded-md border bg-card p-3 transition-colors hover:border-slate-600 hover:shadow-sm',
		className,
		unreadQuestions && 'border-2 border-red-500 hover:border-red-600 hover:bg-red-50'
	)}
>
	<p class="text-sm text-muted-foreground">{recipient}</p>

	<div class="flex items-start justify-between">
		<p class="text-md font-semibold">{name}</p>
		{#if unreadQuestions}
			<Badge variant="destructive" class="gap-1 px-1" title="{unreadQuestions} questions">
				<TablerHelp class="size-4" />
				{unreadQuestions}
			</Badge>
		{:else if price}
			<Badge>{price}</Badge>
		{/if}
	</div>

	{#if questions || comments || numGivers !== undefined}
		<div class="mt-1 flex gap-2">
			{#if numGivers !== undefined}
				<Badge
					class={cn('gap-1 px-1', numGivers > 0 && 'bg-green-600 hover:bg-green-700')}
					variant={numGivers === 0 ? 'outline' : 'default'}
				>
					{#if numGivers === 0}
						<TablerCircleDashed class="size-4" />
					{:else}
						<TablerCircleCheck class="size-4" />
					{/if}
					{numGivers} giver{numGivers !== 1 ? 's' : ''}
				</Badge>
			{/if}
			{#if questions}
				<Badge variant="secondary" class="gap-1 px-1" title="{questions} questions">
					<TablerHelp class="size-4" />
					{questions}
				</Badge>
			{/if}
			{#if comments}
				<Badge variant="secondary" class="gap-1 px-1" title="{comments} giver comments">
					<TablerMessage class="size-4" />
					{comments}
				</Badge>
			{/if}
		</div>
	{/if}

	{@render children?.()}
</a>
