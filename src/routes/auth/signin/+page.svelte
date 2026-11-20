<script>
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import { getBackUrl } from '$lib/return';
	import { page } from '$app/state';
	import SignInForm from '$lib/v2/components/signIn/SignInForm.svelte';
</script>

<svelte:head>
	<title>Sign In - ImGiving</title>
</svelte:head>

<main class="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
	<Button href={getBackUrl(page.url) ?? '/'} variant="ghost" class="mb-2" size="sm"
		><TablerArrowLeft class="size-4" /> Back</Button
	>

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
