<script lang="ts">
	import ListHeader from '$lib/components/ListHeader.svelte';
	import ListLogo from '$lib/components/ListLogo.svelte';
	import Button from '$ui/button/button.svelte';
	import TablerUsers from '~icons/tabler/users';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<ListHeader variant="home">
	<ListLogo name={data.list.name} />

	<nav>
		<Button size="icon" variant="outline" class="w-auto px-2">
			5
			<TablerUsers width={16} height={16} />
		</Button>
	</nav>
</ListHeader>

<pre>{JSON.stringify(data.list, null, 2)}</pre>
