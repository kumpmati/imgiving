<script lang="ts">
	import TablerMessage from '~icons/tabler/message';
	import TablerHelp from '~icons/tabler/help';
	import { cn } from '$lib/utils';
	import { Badge } from '$ui/badge';

	type Props = {
		href: string;
		name: string;
		price: string | null;
		recipient?: string;

		questions?: number;
		unreadQuestions?: number;
		comments?: number;

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
		class: className
	}: Props = $props();
</script>

<a
	{href}
	class={cn(
		'flex max-w-lg flex-col rounded-md border bg-card p-4 transition-colors hover:border-slate-600 hover:shadow-sm',
		className,
		unreadQuestions && 'border-red-500 hover:border-red-600 hover:bg-red-50'
	)}
>
	<p class="text-sm text-muted-foreground">{recipient}</p>

	<div class="flex items-start justify-between">
		<p class="text-lg font-semibold">{name}</p>
		{#if price}
			<Badge>{price}</Badge>
		{/if}
	</div>

	<div class="flex gap-1">
		{#if unreadQuestions}
			<Badge class="gap-1 bg-red-500 px-1">
				<TablerHelp class="size-4" />
				{unreadQuestions}
			</Badge>
		{/if}
		{#if questions}
			<Badge class="gap-1 px-1">
				<TablerHelp class="size-4" />
				{questions}
			</Badge>
		{/if}
		{#if comments}
			<Badge class="gap-1 px-1">
				<TablerMessage class="size-4" />
				{comments}
			</Badge>
		{/if}
	</div>
</a>
