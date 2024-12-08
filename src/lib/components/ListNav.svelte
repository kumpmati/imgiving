<script lang="ts">
	import type { Snippet } from 'svelte';
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		name: string;
		children?: Snippet;
	};

	let { name, children }: Props = $props();
</script>

<header
	class="m-3 flex items-center justify-between rounded-md border border-dashed border-red-500 bg-background p-2 shadow-md"
>
	<a href="/" class="flex items-center gap-2 text-xl font-semibold text-red-500">
		<TablerGiftFilled width={24} height={24} />
		{name}
	</a>

	<nav class="flex gap-2">
		{@render children?.()}
	</nav>
</header>
