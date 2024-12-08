<script lang="ts">
	import type { Wish } from '$lib/server/db/schema';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';
	import { Textarea } from '$ui/textarea';

	type Props = {
		wish?: Wish;
	};

	let { wish }: Props = $props();
</script>

<Label class="flex flex-col gap-1">
	Name
	<Input
		required
		type="text"
		name="name"
		placeholder="Baseball glove, socks, ..."
		value={wish?.name}
	/>
</Label>

<Label class="flex flex-col gap-1">
	Price (optional)
	<Input type="text" name="price" placeholder="10-20 €" value={wish?.price} />
</Label>

<Label class="flex flex-col gap-1">
	Description (optional)
	<Textarea
		name="description"
		class="resize-y"
		placeholder="Shop link, additional info, color, ..."
		value={wish?.description}
	/>
</Label>
