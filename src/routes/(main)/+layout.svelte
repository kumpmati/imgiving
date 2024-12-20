<script lang="ts">
	import MainNav from './MainNav.svelte';

	let { children } = $props();
</script>

<MainNav />

{@render children()}
