<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { cn } from '#lib/utils.ts';

	type Props = {
		isOwn: boolean;
		isOwner: boolean;
		username: string;
		sameAuthorAsPrevious: boolean;
		text: string;
	};

	// TODO: show message time as well
	let { isOwn, isOwner, username, sameAuthorAsPrevious, text }: Props = $props();
</script>

<li class={cn('flex w-full flex-col', isOwn && 'ml-auto items-end')}>
	{#if !sameAuthorAsPrevious}
		<small class={cn('text-sm text-muted-foreground', isOwner && 'text-orange-900')}>
			{isOwn ? 'You' : username}
		</small>
	{/if}

	<p
		class={cn(
			'w-fit max-w-[80%] rounded-2xl bg-slate-200 px-4 py-2 text-base',
			isOwner && 'bg-orange-100 text-orange-900'
		)}
	>
		{text}
	</p>
</li>
