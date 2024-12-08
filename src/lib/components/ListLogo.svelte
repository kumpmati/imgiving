<script lang="ts">
	import TablerGiftFilled from '~icons/tabler/gift-filled';

	type Props = {
		name: string;
	};

	let { name }: Props = $props();
</script>

<a href="/" class="flex items-center gap-2 text-xl font-semibold text-red-500">
	<TablerGiftFilled width={24} height={24} />
	{name}
</a>
