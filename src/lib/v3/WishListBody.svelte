<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<ul class="mt-3 flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg">
	{@render children?.()}
</ul>
