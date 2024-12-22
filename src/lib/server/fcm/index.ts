import { FIREBASE_ADMIN_KEY } from '$env/static/private';
import { FCM, FcmOptions } from 'fcm-cloudflare-workers';

export const fcm = new FCM(
	new FcmOptions({
		serviceAccount: JSON.parse(FIREBASE_ADMIN_KEY)
	})
);
