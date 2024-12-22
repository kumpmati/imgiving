import { browser, dev } from '$app/environment';
import { PUBLIC_FCM_PUBLIC_KEY } from '$env/static/public';
import { firebaseConfig } from '$lib/firebase/config';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, type Messaging, onMessage } from 'firebase/messaging';
import { getContext } from 'svelte';
import { superActions } from 'sveltekit-superactions';
import type { NotificationEndpoint } from '../../../routes/actions/notifications/+server';
import { Toasts } from '../toasts/state.svelte';

export const notificationContextKey = Symbol('notifications');

export const getNotificationContext = () => getContext<NotificationContext>(notificationContextKey);

export class NotificationContext {
	permission = $state<NotificationPermission>();
	allowed = $derived(this.permission === 'granted');

	#messaging = $state<Messaging | undefined>();
	#sw = $state<ServiceWorkerRegistration>();
	#actions = superActions<NotificationEndpoint>('/actions/notifications');
	#toast = $state<Toasts>();

	constructor(t: Toasts) {
		this.#toast = t;

		if (browser) {
			this.permission = Notification.permission;
		}
	}

	async init() {
		this.#messaging = getMessaging(initializeApp(firebaseConfig));
		await navigator.serviceWorker
			.register('/service-worker.js', { type: dev ? 'module' : 'classic' })
			.then((registration) => (this.#sw = registration));
	}

	async updateRegistration() {
		if (!this.#sw) {
			await this.init();
		}

		await this.#sw!.update();
	}

	async requestPermissions() {
		if (!this.#messaging) {
			await this.init();
		}

		await Notification.requestPermission().then(async (status) => {
			this.permission = status;
			if (status === 'granted') {
				await getToken(this.#messaging!, {
					serviceWorkerRegistration: this.#sw,
					vapidKey: PUBLIC_FCM_PUBLIC_KEY
				}).then((token) => {
					console.log('fcm token', token);
					return this.#actions.saveToken(token);
				});
			} else if (status === 'denied') {
				throw new Error('notification permissions denied');
			}
		});
	}

	subscribe() {
		if (!this.#messaging) return;

		return onMessage(this.#messaging, (payload) => {
			if (payload.notification) {
				this.#toast?.info(payload.notification.title ?? 'Notification', payload.notification.body);
			}
			console.log('received notification', { payload });
		});
	}
}
