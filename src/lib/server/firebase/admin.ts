import { FIREBASE_ADMIN_KEY } from '$env/static/private';
import admin from 'firebase-admin';
import type { Messaging } from 'firebase-admin/messaging';

let messaging: Messaging;

export const getFirebaseAdmin = () => {
	if (admin.apps.length > 0 && admin.apps[0]) {
		return admin.apps[0];
	}

	return admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(FIREBASE_ADMIN_KEY))
	});
};

export const getAdminMessaging = () => {
	if (!messaging) {
		messaging = getFirebaseAdmin().messaging();
	}

	return messaging;
};
