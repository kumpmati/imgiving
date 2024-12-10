<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$ui/button';

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

{#if !data.list.users.find((u) => u.userId === data.user?.id)}
	<form method="post" action="?/join_list" use:enhance>
		<Button type="submit">Join wishlist</Button>
	</form>
{:else if data.list.authorId !== data.user?.id}
	<form method="post" action="?/leave_list" use:enhance>
		<Button type="submit" variant="destructive">Leave wishlist</Button>
	</form>
{/if}
