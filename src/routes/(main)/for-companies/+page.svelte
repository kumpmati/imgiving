<script>
	import TablerGiftFilled from '~icons/tabler/gift-filled';
	import TablerGiftCardFilled from '~icons/tabler/gift-card-filled';
</script>

<svelte:head>
	<title>ImGiving - For companies</title>
</svelte:head>

<main class="mx-auto flex max-w-6xl flex-col items-center p-4">
	<section class="relative mt-16 flex flex-col items-center p-4 pb-24">
		<div class="relative mx-auto w-fit">
			<TablerGiftFilled class="absolute -left-16 -top-8 size-6 rotate-12 text-red-600" />
			<TablerGiftCardFilled
				class="absolute -bottom-6 -right-8 size-6 translate-y-full -rotate-6 text-red-600"
			/>

			<h1 class="text-center text-4xl font-extrabold text-red-600 sm:text-6xl">For companies</h1>
		</div>
	</section>

	<p class="max-w-[50ch] text-center text-muted-foreground">
		ImGiving is currently only available for personal use. If you are interested in using it within
		your company or for commercial purposes, you can
		<a
			href="https://forms.gle/db498eG5bhK7sPd58"
			target="_blank"
			rel="noopener noreferrer"
			class="font-semibold text-primary hover:underline"
		>
			join the waiting list.
		</a>
	</p>
</main>
