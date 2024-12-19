<script>
	import Nav from '$lib/components/Nav.svelte';
	import { Button } from '$ui/button';

	import TablerPlus from '~icons/tabler/plus';
	import TablerList from '~icons/tabler/list';
	import TablerCheckbox from '~icons/tabler/checkbox';
</script>

<svelte:head>
	<title>Giftari - Gift coordination made easy</title>
</svelte:head>

<Nav href="/">
	<Button variant="link" href="/pricing">Pricing</Button>
	<Button variant="link" href="/about">About</Button>
</Nav>

<section class="flex flex-col items-center overflow-hidden">
	<div class="relative mt-32 w-full">
		<h1 class="text-center text-6xl font-extrabold text-red-600">
			Gift coordination <br /> made easy.
		</h1>

		<img
			src="/wave1.svg"
			alt="ribbon graphic"
			class="pointer-events-none absolute left-1/2 top-8 -z-[1] h-fit w-[1200px] min-w-[1200px] -translate-x-1/2"
		/>
	</div>

	<p class="mt-8 font-medium text-slate-500">And free for personal use!</p>

	<div class="mt-11 grid grid-cols-2 gap-4">
		<Button href="/list/create" size="lg">Create wishlist</Button>
		<Button href="/#how-does-it-work" variant="secondary" size="lg">How does it work?</Button>
	</div>
</section>

<main class="mt-16 p-4 md:mt-48">
	<h2 id="how-does-it-work" class="text-center text-2xl font-semibold">How does it work?</h2>
	<section class="mx-auto mt-16 flex w-full max-w-7xl flex-col gap-48">
		<div class="flex max-w-[480px] flex-col gap-4">
			<h3 class="inline-flex items-center gap-2 text-3xl font-semibold">
				<TablerPlus class="size-6" /> Create a wishlist
			</h3>
			<p class="text-base text-muted-foreground">
				Think of a wishlist as an extended 'group chat' centered around giving gifts to each other.
			</p>
		</div>

		<div class="flex max-w-[480px] flex-col gap-4">
			<h3 class="inline-flex items-center gap-2 text-3xl font-semibold">
				<TablerList class="size-6" /> List your wishes
			</h3>
			<p class="text-base text-muted-foreground">
				You want a bike, chocolate or socks? Add them to the list! This way others in the wishlist
				know what they can give you.
			</p>
		</div>

		<div class="flex max-w-[480px] flex-col gap-4">
			<h3 class="inline-flex items-center gap-2 text-3xl font-semibold">
				<TablerCheckbox class="size-6" /> Pick gifts for others
			</h3>
			<p class="text-base text-muted-foreground">
				Now you’re presented with a list of all the wishes. Pick from it what you’d like to give.
				Nobody can see what happens to their own wishes, but they can see everything else!
				<br />
				You’ll see if someone else is giving the same gift as you, so you can avoid accidental duplicates.
			</p>
		</div>

		<div class="flex max-w-[480px] flex-col gap-4">
			<h3 class="inline-flex items-center gap-2 text-3xl font-semibold">
				<TablerList class="size-6" /> Go shopping
			</h3>
			<p class="text-base text-muted-foreground">
				You now have a shopping list of all the gifts you’ve picked for others.
				<br />
				Need more info about someone’s gift? Leave them an anonymous question on it!
				<br />
				Want to discuss a gift without the wisher knowing? Leave a comment, everyone else can see it!
			</p>
		</div>
	</section>
</main>
