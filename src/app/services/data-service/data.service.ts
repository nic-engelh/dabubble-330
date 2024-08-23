import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { DocumentData, collection, getFirestore } from 'firebase/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private database: Firestore) {}

  // Method to set a document in Firestore
  async setDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await setDoc(documentRef, data);
  }

  // Method to get a document from Firestore
  async getDocument(collectionName: string, documentId: string): Promise<any> {
    const documentRef = doc(this.database, collectionName, documentId);
    const documentSnapshot = await getDoc(documentRef);
    if (documentSnapshot.exists()) {
      return documentSnapshot.data();
    } else {
      throw new Error('Document does not exist');
    }
  }

  getCollectionRealTime(
    collectionName: string
  ): Observable<any> {
    return new Observable((Subscriber) => {
      const db = getFirestore();
      const collectionRef = collection(db, collectionName);
      onSnapshot(
        collectionRef,
        (querySnap) => {
          const data = querySnap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          Subscriber.next(data);
          console.log(querySnap);
        },
        (error) => Subscriber.error(error)
      );
    });
  }


}
