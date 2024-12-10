<script lang="ts">
	import TablerUsers from '~icons/tabler/users';
	import { Button } from '$ui/button';
	import Logo from './Logo.svelte';

	type Props = {
		wishlistName: string;
		wishlistId: string;
		numUsers: number;
	};

	let { wishlistId, wishlistName, numUsers }: Props = $props();
</script>

<header class="z-10 flex items-center justify-between p-4 sm:sticky sm:top-0">
	<Logo href="/list/{wishlistId}" />

	<nav class="flex items-center gap-2">
		<p class="text-sm leading-none">{wishlistName}</p>
		<Button
			variant="outline"
			href="/list/{wishlistId}/invite"
			class="gap-1 px-2"
			title="{numUsers} members"
		>
			{numUsers}
			<TablerUsers />
		</Button>
	</nav>
</header>
