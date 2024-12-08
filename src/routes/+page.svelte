<script>
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import Input from '$ui/input/input.svelte';
	import Label from '$ui/label/label.svelte';
</script>

<Card.Root>
	<form method="post" class="contents">
		<Card.Content>
			<Label class="flex flex-col">
				Name
				<Input type="text" name="name" required />
			</Label>
		</Card.Content>
		<Card.Footer>
			<Button type="submit">Create list</Button>
		</Card.Footer>
	</form>
</Card.Root>
