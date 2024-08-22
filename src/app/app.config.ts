import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-330',
        appId: '1:800106272913:web:c0cb27877ba554e460c730',
        databaseURL:
          'https://dabubble-330-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'dabubble-330.appspot.com',
        apiKey: 'AIzaSyCV2rfEpdiod6Loa7F0Ns-QizvPz9z35-4',
        authDomain: 'dabubble-330.firebaseapp.com',
        messagingSenderId: '800106272913',
        measurementId: 'G-W5D72JRRJB',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
  ],
};
