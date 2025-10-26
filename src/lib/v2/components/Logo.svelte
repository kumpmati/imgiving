<script lang="ts">
	import { cn } from '$lib/utils';
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		href?: string;
		title?: string;
	};

	let { href, title }: Props = $props();
</script>

<a
	{href}
	class={cn('flex items-center gap-2 text-xl font-semibold text-red-600 hover:text-red-700')}
>
	<TablerGiftFilled class="size-6" />
	{title}
</a>
