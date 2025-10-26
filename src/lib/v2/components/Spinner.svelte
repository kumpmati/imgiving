<script lang="ts">
	import { cn } from '$lib/utils';
	import TablerLoader2 from '~icons/tabler/loader-2';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();
</script>

<TablerLoader2 class={cn('inline-flex animate-spin', className)} />
