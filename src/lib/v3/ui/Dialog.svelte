<script lang="ts">
	import { cn } from '#lib/utils.ts';
	import { onMount, type Snippet } from 'svelte';

	type Props = {
		open: boolean;
		children: Snippet;
		class?: string;
		onClose?: () => void;
	};

	let { children, open = $bindable(), onClose, class: classes }: Props = $props();

	let ref: HTMLDialogElement;

	$effect(() => {
		if (open) ref?.showModal();
		else ref?.close();
	});

	onMount(() => {
		const handleClose = () => {
			open = false;
			onClose?.();
		};

		const handleClickOutside = (e: Event) => {
			if (e.target === ref) ref?.close();
		};

		ref.addEventListener('close', handleClose);
		ref.addEventListener('click', handleClickOutside);

		return () => {
			ref.removeEventListener('close', handleClose);
			ref.removeEventListener('click', handleClickOutside);
		};
	});

	// TODO: close when clicked outside
</script>

<dialog
	bind:this={ref}
	class={cn('z-10 mx-auto my-auto max-w-[calc(100%-2rem)] rounded-[32px] p-0 shadow-2xl', classes)}
>
	<div class="p-4">
		{@render children()}
	</div>
</dialog>

<style lang="scss">
	@keyframes swipe-bottom {
		from {
			opacity: 0;
			transform: translateY(100%);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
			backdrop-filter: blur(0px);
		}
	}

	dialog {
		--duration: 300ms;

		transform-origin: 50% 50%;

		transition:
			translate var(--duration),
			opacity var(--duration),
			scale var(--duration),
			transform var(--duration),
			display var(--duration) allow-discrete;
		transition-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1); /* expo-out */

		&[open] {
			/* Post-Entry (Normal) State */
			translate: 0 0rem;
			opacity: 1;
			transform: scale(1);

			/* Pre-Entry State */
			@starting-style {
				translate: 0 1rem;
				opacity: 0;
				transform: scale(0.9);
			}
		}

		/* Exiting State */
		&:not([open]) {
			--duration: 0;
		}
	}

	dialog::backdrop {
		animation: fade 500ms;
		animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1); /* expo-out */
	}
</style>
