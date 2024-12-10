<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.list.name}</title>
</svelte:head>

<h2 class="text-2xl font-semibold">{data.list.name}</h2>

<small class="text-sm text-muted-foreground">Members ({data.list.users.length})</small>
<ul>
	{#each data.list.users as user (user.userId)}
		<li>{user.user.name}</li>
	{/each}
</ul>
