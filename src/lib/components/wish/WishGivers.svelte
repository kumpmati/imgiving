<script lang="ts">
	import TablerCircleDashedCheck from '~icons/tabler/circle-dashed-check';
	import TablerCircleCheck from '~icons/tabler/circle-check';
	import type { User } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';

	type Props = {
		givers: User[];
		class?: string;
	};

	let { givers, class: className }: Props = $props();
</script>

<div class={cn('flex h-fit flex-col gap-1 rounded-md border bg-card p-4', className)}>
	<div
		class={cn('flex items-center gap-1', givers.length > 0 ? 'text-green-500' : 'text-slate-500')}
	>
		{#if givers.length > 0}
			<TablerCircleCheck class="size-4" />
		{:else}
			<TablerCircleDashedCheck class="size-4" />
		{/if}
		<span>{givers.length} want{givers.length === 1 ? 's' : ''} to give this</span>
	</div>

	<ul class="flex flex-col">
		{#each givers as giver (giver.id)}
			<li>{giver.name}</li>
		{/each}
	</ul>
</div>
