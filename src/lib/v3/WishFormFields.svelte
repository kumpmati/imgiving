<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Input from './ui/Input.svelte';
	import Textarea from './ui/Textarea.svelte';

	type Props = {
		name: string;
		description: string | null;
		price: number | null;
		imageUrl: string | null;
	};

	let {
		name = $bindable(),
		description = $bindable(),
		price = $bindable(),
		imageUrl = $bindable()
	}: Props = $props();
</script>

<label class="flex flex-col gap-1 text-sm font-medium text-slate-500">
	{m.formfield_wish_name()}
	<Input placeholder="Headphones" required name="name" type="text" bind:value={name} />
</label>

<label class="flex flex-col gap-1 text-sm font-medium text-slate-500">
	{m.formfield_wish_description()}
	<Textarea
		placeholder="Extra info about the wish..."
		name="description"
		bind:value={description}
	/>
</label>

<label class="flex flex-col gap-1 text-sm font-medium text-slate-500">
	{m.formfield_wish_price()}
	<Input placeholder="5 €" name="price" type="number" min="0" step="0.01" bind:value={price} />
</label>

<label class="flex flex-col gap-1 text-sm font-medium text-slate-500">
	{m.formfield_wish_image_url()}

	<div class="flex items-center">
		<Input
			placeholder="https://link_to_an_image_here"
			name="imageUrl"
			type="url"
			bind:value={imageUrl}
		/>

		{#if imageUrl}
			<img src={imageUrl} alt="" class="ml-2 aspect-square size-12 rounded-xl object-cover" />
		{/if}
	</div>
</label>
