// Import the functions you need from the SDKs you need

import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';
import { type FirebaseOptions } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	authDomain: `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
	storageBucket: `${PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};
