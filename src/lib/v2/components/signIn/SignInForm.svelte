<script lang="ts">
	import { enhance } from '$app/forms';
	import TablerBrandGoogleFilled from '~icons/tabler/brand-google-filled';
	import { Button } from '#lib/v2/components/ui/button/index.ts';
	import Input from '#lib/v2/components/ui/input/input.svelte';
	import { Label } from '#lib/v2/components/ui/label/index.ts';
	import Spinner from '../Spinner.svelte';

	type Props = {
		action?: string;
		backUrl?: string;
	};

	let { action, backUrl }: Props = $props();

	let loading = $state(false);
</script>

<form
	class="flex flex-col gap-2"
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
	<p class="text-sm font-medium">
		Create temporary account <small class="text-muted-foreground">(deleted after 30 days)</small>
	</p>

	<Label>
		<Input type="text" name="name" required placeholder="First name" maxlength={40} />
		<small class="text-muted-foreground"></small>
	</Label>

	<Button type="submit" class="mt-2 w-full" disabled={loading}>
		{#if loading}
			<Spinner class="size-4" /> Signing up...
		{:else}
			Sign Up
		{/if}
	</Button>
</form>

<div class="my-2 flex items-center gap-2">
	<div class="w-full border-b"></div>
	<small class="text-muted-foreground shrink-0 text-center">Or continue with</small>
	<div class="w-full border-b"></div>
</div>

<Button
	href={backUrl ? `/auth/google/signin?back=${backUrl}` : '/auth/google/signin'}
	data-sveltekit-preload-data={false}
	size="lg"
	variant="outline"
>
	Google <TablerBrandGoogleFilled />
</Button>
