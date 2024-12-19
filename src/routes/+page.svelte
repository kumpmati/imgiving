<script>
	import { Button } from '$ui/button';
	import TablerList from '~icons/tabler/list';
	import TablerCheckbox from '~icons/tabler/checkbox';
	import TablerShoppingCart from '~icons/tabler/shopping-cart';
	import TablerGiftFilled from '~icons/tabler/gift-filled';
	import TablerGiftCardFilled from '~icons/tabler/gift-card-filled';
	import Section from './Section.svelte';
	import MainNav from './MainNav.svelte';
</script>

<svelte:head>
	<title>Giftari - Gift coordination made easy</title>
</svelte:head>

<MainNav />

<section class="relative flex flex-col items-center overflow-hidden p-4 pb-24">
	<div id="hero-bg" class="absolute left-0 top-0 -z-10 h-full w-full"></div>

	<div class="relative mt-32 w-full sm:mt-48">
		<img
			src="/wave1.svg"
			alt="ribbon graphic"
			class="pointer-events-none absolute -top-4 left-1/2 -z-[1] h-fit w-[1200px] min-w-[1200px] -translate-x-1/2 sm:top-6"
		/>

		<div class="relative mx-auto w-fit">
			<TablerGiftFilled
				class="absolute -right-8 -top-8 size-6 translate-x-full rotate-12 text-red-600"
			/>
			<TablerGiftCardFilled
				class="absolute -bottom-6 -left-3 size-6 translate-y-full -rotate-6 text-red-600"
			/>

			<h1 class="text-center text-4xl font-extrabold text-red-600 sm:text-6xl">
				Gift coordination <br /> made easy.
			</h1>
		</div>
	</div>

	<p class="mt-2 font-medium text-slate-500 sm:mt-8">And free for personal use!</p>

	<div class="mt-11 grid grid-cols-1 gap-2 sm:grid-cols-2">
		<Button href="/list/create" size="lg">Create wishlist</Button>
		<Button href="/#how-does-it-work" variant="secondary" size="lg">How does it work?</Button>
	</div>
</section>

<main class="mt-0 overflow-x-hidden p-4 md:mt-16">
	<div class="flex flex-col gap-2 text-center">
		<h2 id="how-does-it-work" class="text-center text-2xl font-semibold">
			How does a wishlist work?
		</h2>

		<p class="text-muted-foreground">There's three simple steps:</p>
	</div>

	<section class="mx-auto mt-24 flex w-full max-w-6xl flex-col items-center gap-32 pb-64 lg:gap-56">
		<Section textPosition="left">
			{#snippet title()}
				<TablerList class="size-6 text-slate-500" /> List your wishes
			{/snippet}
			{#snippet description()}
				You want a bike, chocolate or socks? Add them to the list! This way others in the wishlist
				know what they can give you.
				<br />
				<br />
				Keep in mind that you can't choose or know who is going to give you which gifts.
			{/snippet}

			<img src="/wishlist.svg" alt="" class="lg:min-w-[400px]" />
		</Section>

		<Section textPosition="right">
			{#snippet title()}
				<TablerCheckbox class="size-6 text-slate-500" /> Pick gifts for others
			{/snippet}
			{#snippet description()}
				When other people in the wishlist have also listed their wishes, pick what you’d like to
				give. Nobody can see what happens to their own wishes, but they can see everything else!
				<br />
				<br />
				You’ll see if someone else is giving the same gift as you, so you can avoid accidental duplicates.
			{/snippet}

			<img src="/wishpicker.svg" alt="" class="lg:min-w-[400px]" />
		</Section>

		<Section textPosition="left">
			{#snippet title()}
				<TablerShoppingCart class="size-6 text-slate-500" /> Go shopping
			{/snippet}
			{#snippet description()}
				You now have a shopping list of all the gifts you’ve picked for others.
				<br />
				<br />
				Need more info about someone’s gift? Leave them an anonymous question on it!
				<br />
				<br />
				Want to discuss a gift without the wisher knowing? Leave a comment, everyone else can see it!
			{/snippet}

			<div class="relative">
				<img src="/shoppinglist.svg" alt="" class="lg:min-w-[400px]" />
				<img
					src="/wave3.svg"
					alt=""
					class="absolute -bottom-20 -left-16 -z-10 min-w-[120%] -scale-x-100"
				/>
			</div>
		</Section>
	</section>
</main>

<style>
	#hero-bg {
		background-color: #ffffff;
		opacity: 0.8;
		background-size: 10px 10px;
		background-image: repeating-linear-gradient(
			45deg,
			#fff2f2 0,
			#fff2f2 1px,
			#ffffff 0,
			#ffffff 50%
		);
	}

	#hero-bg::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 128px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
	}
</style>
