<script>
	import { enhance } from '$app/forms';
	import TablerBrandGoogleFilled from '~icons/tabler/brand-google-filled';
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import Input from '$ui/input/input.svelte';
	import { getBackUrl } from '$lib/return';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Sign In - Giftari</title>
</svelte:head>

<main class="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
	<Button href={getBackUrl($page.url) ?? '/'} variant="ghost" class="mb-2" size="sm">
		<TablerArrowLeft class="size-4" /> Back
	</Button>

	<Card.Root>
		<Card.Header>
			<Card.Title>Create account</Card.Title>
			<Card.Description>You need to sign in before continuing</Card.Description>
		</Card.Header>

		<Card.Content class="flex flex-col gap-2">
			<form class="contents" method="post" use:enhance>
				<small class="my-4 text-center text-muted-foreground">
					Create anonymous account (deleted after 30 days)
				</small>

				<Input type="text" name="name" required placeholder="First name" maxlength={40} />

				<Button type="submit" class="mt-2 w-full">Create account</Button>
			</form>

			<div class="flex items-center gap-2">
				<div class="w-full border-b"></div>
				<small class="my-4 shrink-0 text-center text-muted-foreground">Or continue with</small>
				<div class="w-full border-b"></div>
			</div>

			<Button href="/auth/google/signin" data-sveltekit-preload-data="off" variant="outline">
				Google <TablerBrandGoogleFilled />
			</Button>
		</Card.Content>
	</Card.Root>
</main>
