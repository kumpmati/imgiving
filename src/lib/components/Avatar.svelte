<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = {
		userId: string;
		class?: string;
	} & HTMLImgAttributes;

	let { userId, class: className, ...rest }: Props = $props();
</script>

<!-- TODO: generate on the fly to avoid using dicebear api -->
<img
	src="https://api.dicebear.com/9.x/fun-emoji/svg?seed={userId}"
	alt=""
	class={cn('block size-6 rounded-full', className)}
	{...rest}
/>
