import { browser, dev } from '$app/env';
import { PUBLIC_FCM_PUBLIC_KEY } from '$app/env/public';
import { firebaseConfig } from '#lib/firebase/config.ts';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, type Messaging, onMessage } from 'firebase/messaging';
import { Toasts } from '../toasts/state.svelte';
import { saveToken } from '#lib/queries/fcm.remote.ts';

const supportsNotification = 'Notification' in window;

export class NotificationContext {
	permission = $state<NotificationPermission>();
	allowed = $derived(this.permission === 'granted');

	#messaging = $state<Messaging | undefined>();
	#sw = $state<ServiceWorkerRegistration>();
	#toast = $state<Toasts>();

	constructor(t: Toasts) {
		this.#toast = t;

		if (browser && supportsNotification) {
			// Notification is undefined on some devices, can't assume it's not null.
			this.permission = window.Notification.permission ?? 'default';
		}
	}

	async init() {
		this.#messaging = getMessaging(initializeApp(firebaseConfig));
		await navigator.serviceWorker
			.register('/service-worker.js', { type: dev ? 'module' : 'classic', scope: '/' })
			.then((registration) => (this.#sw = registration));
	}

	async updateRegistration() {
		if (!this.#sw) {
			await this.init();
		}

		await this.#sw!.update();
	}

	async requestPermissions() {
		if (!supportsNotification) {
			return;
		}

		if (!this.#messaging) {
			await this.init();
		}

		await window.Notification.requestPermission().then(async (status) => {
			this.permission = status;
			if (status === 'granted') {
				await getToken(this.#messaging!, {
					serviceWorkerRegistration: this.#sw,
					vapidKey: PUBLIC_FCM_PUBLIC_KEY
				}).then((token) => {
					console.log('fcm token', token);
					return saveToken(token);
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
