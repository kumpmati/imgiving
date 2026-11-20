<script lang="ts">
	import { page } from '$app/state';
	import Nav from '$lib/v2/components/Nav.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$ui/button';
	import TablerUser from '~icons/tabler/user';

	const userState = getUserContext();
</script>

<Nav title="ImGiving" href="/" class={cn(page.url.pathname === '/' && 'absolute')}>
	<Button
		variant="link"
		href="/for-companies"
		class={cn(page.url.pathname === '/for-companies' && 'font-semibold underline')}
		>For companies</Button
	>

	<Button
		variant="link"
		href="/support"
		class={cn(page.url.pathname === '/support' && 'font-semibold underline')}>Support</Button
	>

	{#if userState.current}
		<Button variant="outline" href="/account" size="icon">
			<TablerUser />
		</Button>
	{:else}
		<Button variant="outline" href="/auth/signin">Sign In</Button>
	{/if}
</Nav>
