<script lang="ts">
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		href: string;
		titleHref?: string;
		title?: string;
	};

	let { href, titleHref = href, title }: Props = $props();
</script>

<div class="flex items-center gap-1 text-xl font-semibold text-red-600">
	<a {href} class="transition-colors hover:text-primary">
		<TablerGiftFilled width={24} height={24} />
	</a>
	{#if title}
		<a href={titleHref}>
			<span class="hidden sm:inline">{title}</span>
		</a>
	{/if}
</div>
