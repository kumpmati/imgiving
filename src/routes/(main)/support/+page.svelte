<script>
	import TablerGiftFilled from '~icons/tabler/gift-filled';
	import TablerGiftCardFilled from '~icons/tabler/gift-card-filled';
	import TablerCoffee from '~icons/tabler/coffee';
</script>

<svelte:head>
	<title>ImGiving - Support</title>
</svelte:head>

<main class="mx-auto flex max-w-6xl flex-col items-center p-4">
	<section class="relative mt-16 flex flex-col items-center p-4 pb-24">
		<div class="relative mx-auto w-fit">
			<TablerGiftFilled class="absolute -left-16 -top-8 size-6 rotate-12 text-red-600" />
			<TablerGiftCardFilled
				class="absolute -bottom-6 -right-8 size-6 translate-y-full -rotate-6 text-red-600"
			/>

			<h1 class="text-center text-4xl font-extrabold text-red-600 sm:text-6xl">
				Give your support
			</h1>
		</div>
	</section>

	<p class="max-w-[50ch] text-center text-muted-foreground">
		ImGiving is free for personal use, and doesn't have ads. If you like, you can help cover running
		costs by
		<a
			href="https://buymeacoffee.com/kumpmati"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
		>
			<TablerCoffee class="size-4" />
			Buying me a coffee.
		</a>
	</p>
</main>
