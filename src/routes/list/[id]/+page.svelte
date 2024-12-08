<script lang="ts">
	import ListNav from '$lib/components/ListNav.svelte';
	import Button from '$ui/button/button.svelte';
	import TablerUsers from '~icons/tabler/users';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<ListNav name={data.list.name}>
	<Button size="icon" variant="outline" class="w-auto px-2">
		5
		<TablerUsers width={16} height={16} />
	</Button>
</ListNav>

<pre>{JSON.stringify(data.list, null, 2)}</pre>
