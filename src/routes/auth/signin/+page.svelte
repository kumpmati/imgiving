<script lang="ts">
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import { Button } from '#lib/v2/components/ui/button/index.js';
	import * as Card from '#lib/v2/components/ui/card/index.js';
	import { getBackUrl } from '#lib/return.ts';
	import { page } from '$app/state';
	import SignInForm from '#lib/v2/components/signIn/SignInForm.svelte';
</script>

<svelte:head>
	<title>Sign In - ImGiving</title>
</svelte:head>

<main class="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
	<Button href={getBackUrl(page.url as URL) ?? '/'} variant="ghost" class="mb-2" size="sm">
		<TablerArrowLeft class="size-4" /> Back
	</Button>

	<Card.Root>
		<Card.Header>
			<Card.Title>Create account</Card.Title>
			<Card.Description>You need to sign in before continuing</Card.Description>
		</Card.Header>

		<Card.Content class="flex flex-col gap-2">
			<SignInForm />
		</Card.Content>
	</Card.Root>
</main>
