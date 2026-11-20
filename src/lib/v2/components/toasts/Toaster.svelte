<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import type { Toasts } from './state.svelte';
	import TablerCircleCheckFilled from '~icons/tabler/circle-check-filled';
	import TablerAlertTriangle from '~icons/tabler/alert-triangle';
	import TablerCircleXFilled from '~icons/tabler/circle-x-filled';
	import TablerInfoCircleFilled from '~icons/tabler/info-circle-filled';
	import { cn } from '#lib/utils.ts';

	type Props = {
		state: Toasts;
	};

	let { state }: Props = $props();
</script>

{#if state.messages.length > 0}
	<ul
		class="fixed bottom-0 right-0 z-[1000000] flex w-full max-w-96 flex-col items-stretch gap-2 p-4"
	>
		{#each state.messages as m (m.id)}
			<li
				animate:flip={{ duration: 400 }}
				in:fly|global={{ duration: 300, x: 50 }}
				out:scale|global={{ duration: 300, start: 0.95 }}
				class="flex"
			>
				<button
					onclick={() => state.dismiss(m.id)}
					class={cn(
						'z-0 flex w-full gap-2 rounded-lg border bg-card p-4 text-left text-sm shadow-lg sm:w-96',
						m.type === 'success' && 'text-primary'
					)}
				>
					<div class="flex">
						{#if m.type === 'warn'}
							<TablerAlertTriangle class="size-5 text-orange-500" />
						{:else if m.type === 'err'}
							<TablerCircleXFilled class="size-5 text-red-500" />
						{:else if m.type === 'info'}
							<TablerInfoCircleFilled class="size-5" />
						{:else}
							<TablerCircleCheckFilled class="size-5 text-green-500" />
						{/if}
					</div>

					<div class="flex flex-col">
						<span class="font-medium">
							{m.message}
						</span>

						{#if m.detail}
							<span class="text-muted-foreground">{m.detail}</span>
						{/if}
					</div>
				</button>
			</li>
		{/each}
	</ul>
{/if}
