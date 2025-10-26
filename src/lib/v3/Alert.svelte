<script lang="ts">
	import TablerHelp from '~icons/tabler/help';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		type: 'error' | 'warning';
		children: Snippet;
	};

	let { type, children }: Props = $props();
</script>

<div
	class={cn(
		'flex gap-2 rounded-xl p-3 font-semibold',
		type === 'error' && 'bg-red-200 text-red-700',
		type === 'warning' && 'bg-orange-200 text-orange-700'
	)}
>
	<TablerHelp class="size-6 min-w-6" />

	{@render children()}
</div>
