<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		isOwn: boolean;
		sameAuthorAsPrevious: boolean;
		text: string;
	};

	// TODO: show message time as well
	let { isOwn, sameAuthorAsPrevious, text }: Props = $props();
</script>

<li class={cn('flex w-full flex-col', isOwn && 'ml-auto items-end')}>
	{#if !sameAuthorAsPrevious}
		<small class="text-sm text-muted-foreground">{isOwn ? 'You' : 'Anonymous'}</small>
	{/if}

	<p
		class={cn(
			'w-fit max-w-[80%] rounded-md bg-slate-200 px-3 py-1.5 text-base shadow-sm',
			isOwn && 'bg-orange-200'
		)}
	>
		{text}
	</p>
</li>
