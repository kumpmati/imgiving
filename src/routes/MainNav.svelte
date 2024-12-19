<script>
	import { page } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$ui/button';
</script>

<Nav href="/" class={cn($page.url.pathname === '/' && 'fixed')}>
	<Button
		variant="link"
		href="/for-companies"
		class={cn($page.url.pathname === '/for-companies' && 'font-semibold underline')}
	>
		For companies
	</Button>
	<Button
		variant="link"
		href="/support"
		class={cn($page.url.pathname === '/support' && 'font-semibold underline')}>Support us</Button
	>
</Nav>
