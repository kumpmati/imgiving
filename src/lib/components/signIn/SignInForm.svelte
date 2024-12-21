<script lang="ts">
	import { enhance } from '$app/forms';
	import TablerBrandGoogleFilled from '~icons/tabler/brand-google-filled';
	import { Button } from '$ui/button';
	import Input from '$ui/input/input.svelte';
	import { Label } from '$ui/label';
	import Spinner from '../Spinner.svelte';

	type Props = {
		action?: string;
		backUrl?: string;
	};

	let { action, backUrl }: Props = $props();

	let loading = $state(false);
</script>

<form
	class="contents"
	method="post"
	{action}
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}
>
	<Label>
		<Input type="text" name="name" required placeholder="First name" maxlength={40} />
		<small class="text-muted-foreground"> Create anonymous account (deleted after 30 days) </small>
	</Label>

	<Button type="submit" class="mt-2 w-full" disabled={loading}>
		{#if loading}
			<Spinner class="size-4" /> Signing up...
		{:else}
			Sign Up
		{/if}
	</Button>
</form>

<div class="flex items-center gap-2">
	<div class="w-full border-b"></div>
	<small class="my-4 shrink-0 text-center text-muted-foreground">Or continue with</small>
	<div class="w-full border-b"></div>
</div>

<Button
	href={backUrl ? `/auth/google/signin?back=${backUrl}` : '/auth/google/signin'}
	data-sveltekit-preload-data="off"
	size="lg"
	variant="outline"
>
	Google <TablerBrandGoogleFilled />
</Button>
