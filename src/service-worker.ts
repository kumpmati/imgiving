// service-worker.ts is bundled and registered automatically by SvelteKit
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
	// TODO: this works but types don't like it, fix
} from '$env/static/public';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { onMessage } from 'firebase/messaging';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

const sw = self as unknown as ServiceWorkerGlobalScope;

export const firebaseConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	authDomain: `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
	storageBucket: `${PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

console.log('sw initialised');

onMessage(messaging, (payload) => {
	sw.registration.showNotification(payload.notification?.title ?? 'Notification', {
		...payload.notification,
		icon: payload.notification?.icon ?? 'https://imgiving.app/favicon.svg'
	});
});

onBackgroundMessage(messaging, (payload) => {
	sw.registration.showNotification(payload.notification?.title ?? 'Notification', {
		...payload.notification,
		icon: payload.notification?.icon ?? 'https://imgiving.app/favicon.svg'
	});
});
