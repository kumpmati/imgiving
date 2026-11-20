<script lang="ts">
	import { Checkbox as CheckboxPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import TablerMinus from '~icons/tabler/minus';
	import TablerCheck from '~icons/tabler/check';

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	class={cn(
		'peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground box-content size-4 shrink-0 rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
		className
	)}
	bind:checked
	bind:ref
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="flex items-center justify-center text-current">
			{#if indeterminate}
				<TablerMinus class="size-4" />
			{:else}
				<TablerCheck class={cn('size-4', !checked && 'text-transparent')} />
			{/if}
		</span>
	{/snippet}
</CheckboxPrimitive.Root>
