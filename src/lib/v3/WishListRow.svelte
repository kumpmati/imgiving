<script lang="ts">
	import { cn } from '#lib/utils.ts';
	import TablerGift from '~icons/tabler/gift';
	import TablerCheck from '~icons/tabler/check';

	type Props = {
		name: string;
		imageUrl: string | null;
		priceCents: number | null;
		numGivers?: number;
		showQuestionButton?: boolean;
		giving: boolean;
		onClick?: () => void;
	};

	let { name, imageUrl, priceCents, numGivers, showQuestionButton, giving, onClick }: Props =
		$props();
</script>

<button
	class={cn(
		'flex w-full items-center gap-4 border-b border-slate-100 p-3 transition-colors hover:bg-slate-50',
		giving && 'bg-green-50 text-green-600 hover:bg-green-100'
	)}
	onclick={onClick}
>
	<div
		class={cn(
			'relative flex size-12 min-w-12 items-center justify-center overflow-hidden rounded-xl bg-red-50',
			giving && 'bg-green-100'
		)}
	>
		{#if giving}
			<TablerCheck class="size-6 text-green-600" />
		{:else if !imageUrl}
			<TablerGift class="size-6 text-red-400" />
		{:else}
			<img src={imageUrl} alt="" class="size-full object-cover" />
		{/if}
	</div>

	<div class="flex flex-col gap-1 overflow-hidden">
		<p class="overflow-hidden overflow-ellipsis whitespace-nowrap text-left text-base font-medium">
			{name}
		</p>
		{#if priceCents}
			<p class="flex w-fit rounded-full bg-red-100 px-2 py-0 text-sm text-red-600">
				{priceCents / 100} €
			</p>
		{/if}
	</div>

	{#if numGivers !== undefined}
		<div class="ml-auto flex items-center">
			{#each { length: Math.min(numGivers, 5) }, index}
				<div
					class={cn(
						'-ml-[18px] size-7 rounded-full border-2 border-white bg-slate-200 text-slate-500',
						giving && 'border-green-50'
					)}
				>
					{#if index == numGivers - 1}
						{numGivers}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</button>
