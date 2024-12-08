<script>
	import { enhance } from '$app/forms';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import Input from '$ui/input/input.svelte';
</script>

<main class="mx-auto flex h-full w-full max-w-lg flex-col justify-center p-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Create account</Card.Title>
			<Card.Description>Don't worry, only a name is needed!</Card.Description>
		</Card.Header>
		<form class="contents" method="post" use:enhance>
			<Card.Content class="flex-col">
				<Input type="text" name="name" required placeholder="Name" maxlength={40} />
			</Card.Content>

			<Card.Footer class="flex-col gap-2 sm:flex-row">
				<Button variant="outline" class="w-full" href="/">Cancel</Button>
				<Button type="submit" class="w-full">Create account</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>
