<script lang="ts">
	import Button, { buttonVariants } from '$ui/button/button.svelte';
	import * as Dialog from '$ui/dialog';
	import { onMount } from 'svelte';
	import { getNotificationContext } from './context.svelte';
	import Spinner from '../Spinner.svelte';
	import { getToast } from '../toasts/context';

	const notifications = getNotificationContext();
	const toast = getToast();

	let open = $state(false);
	let loading = $state(false);

	onMount(() => {
		console.log(Notification.permission, localStorage.getItem('imgiving-notifications'));
		if (Notification.permission === 'default' && !localStorage.getItem('imgiving-notifications')) {
			open = true;
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Enable notifications</Dialog.Title>
			<Dialog.Description>
				It's highly recommended to enable notifications. This way you get instantly notified when
				someone asks a question about your wishes.
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer class="gap-2">
			<Dialog.Close
				onclick={() => localStorage.setItem('imgiving-notifications', 'ignore')}
				class={buttonVariants({ variant: 'secondary' })}
			>
				Close
			</Dialog.Close>
			<Button
				onclick={() => {
					loading = true;
					notifications
						.requestPermissions()
						.then(() => {
							open = false;
							loading = false;
							toast.success(
								'Notifications enabled',
								'You will receive notifications when you receive questions about your wishes'
							);
						})
						.catch(() => {
							// TODO: handle re-enabling later
							loading = false;
							open = false;
							toast.error('Notification permissions denied');
						});
				}}
				disabled={loading}
			>
				{#if loading}
					<Spinner class="size-4" /> Requesting permission...
				{:else}
					Request permission
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
