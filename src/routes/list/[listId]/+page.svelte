<script lang="ts">
	import ListLayout from './ListLayout.svelte';

	let { data } = $props();
</script>

<ListLayout>
	{#snippet start()}
		<p>start</p>
	{/snippet}
	{#snippet wish()}
		<p>wish</p>
	{/snippet}
	{#snippet give()}
		<p>give</p>
	{/snippet}
	{#snippet shop()}
		<p>shop</p>
	{/snippet}
</ListLayout>
