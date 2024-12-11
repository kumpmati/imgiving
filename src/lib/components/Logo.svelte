<script lang="ts">
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		href: string;
	};

	let { href }: Props = $props();
</script>

<a {href} class="flex items-center gap-1 text-xl font-semibold text-red-600" title="Giftari">
	<TablerGiftFilled width={24} height={24} />
	<span class="hidden sm:inline">Giftari</span>
</a>
