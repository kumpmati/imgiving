<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<h1>{data.list.name}</h1>
