import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: extra.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: extra.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: extra.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    extra.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: extra.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error(
    'Erro Crítico: A API Key do Firebase não foi carregada. Verifique o arquivo .env.',
  );
}

const app = initializeApp(firebaseConfig);

/**
 * Inicializa o Auth com persistência nativa (AsyncStorage) no mobile
 * e com persistência padrão (indexedDB) na web.
 *
 * O require condicional evita que o webpack tente resolver
 * 'getReactNativePersistence' no bundle web, onde esse export não existe.
 */
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require('firebase/auth');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
