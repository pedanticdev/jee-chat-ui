// firebase-config.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {getStorage} from "firebase/storage";



const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.FIREBASE_CONFIG?.landing.apikey,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_CONFIG?.landing.authdomain,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_CONFIG?.landing.projectid,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_CONFIG?.landing.storagebucket,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_CONFIG?.landing.messagingsenderid,
    appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.FIREBASE_CONFIG?.landing.appid
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);