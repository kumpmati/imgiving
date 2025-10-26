<script lang="ts">
	import { m } from '$lib/paraglide/messages';

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

<label class="flex flex-col gap-0.5 text-sm font-medium text-slate-500">
	{m.formfield_wish_name()}
	<input
		placeholder="Headphones"
		required
		name="name"
		type="text"
		bind:value={name}
		class="rounded-xl bg-slate-200 px-3 py-2 text-base font-normal text-black placeholder-slate-400"
	/>
</label>

<label class="flex flex-col gap-0.5 text-sm font-medium text-slate-500">
	{m.formfield_wish_description()}
	<textarea
		placeholder="Extra info about the wish..."
		name="description"
		bind:value={description}
		class="resize-y rounded-xl bg-slate-200 px-3 py-2 text-base font-normal text-black placeholder-slate-400"
	></textarea>
</label>

<label class="flex flex-col gap-0.5 text-sm font-medium text-slate-500">
	{m.formfield_wish_price()}
	<input
		placeholder="5 €"
		name="price"
		type="number"
		min="0"
		step="0.01"
		bind:value={price}
		class="rounded-xl bg-slate-200 px-3 py-2 text-base font-normal text-black placeholder-slate-400"
	/>
</label>

<label class="flex flex-col gap-0.5 text-sm font-medium text-slate-500">
	{m.formfield_wish_image_url()}

	<div class="flex items-center">
		<input
			placeholder="https://link_to_an_image_here"
			name="imageUrl"
			type="url"
			bind:value={imageUrl}
			class="w-full rounded-xl bg-slate-200 px-3 py-2 text-base font-normal text-black placeholder-slate-400"
		/>

		{#if imageUrl}
			<img src={imageUrl} alt="" class="ml-2 aspect-square size-12 rounded-xl object-cover" />
		{/if}
	</div>
</label>
