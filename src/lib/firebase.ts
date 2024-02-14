import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { env } from '../env'

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MASSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_API_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
