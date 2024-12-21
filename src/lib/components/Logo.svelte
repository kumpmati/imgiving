<script lang="ts">
	import { cn } from '$lib/utils';
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		size?: 'lg' | 'sm';
		href?: string;
		titleHref?: string;
		title?: string;
	};

	let { size = 'lg', href, titleHref = href, title }: Props = $props();
</script>

<div
	class={cn(
		'flex items-center gap-0.5 text-sm font-semibold text-red-600',
		size === 'lg' && 'gap-1 text-xl'
	)}
>
	<a {href} class="transition-colors hover:text-red-700">
		<TablerGiftFilled class={size === 'lg' ? 'size-6' : 'size-4'} />
	</a>
	{#if title}
		<a href={titleHref} class="transition-colors hover:text-red-700">
			<span class="hidden sm:inline">{title}</span>
		</a>
	{/if}
</div>
