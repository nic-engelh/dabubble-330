import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  CollectionReference,
  DocumentReference,
  onSnapshot,
} from '@angular/fire/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private database: Firestore = inject(Firestore);

  // Method to set a document in Firestore
  async setDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await setDoc(documentRef, data);
  }

  async setDocumentToSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subdocumentId: string,
    data: any
  ): Promise<any> {
    const collectionRef = collection(this.database, collectionName);
    const documentRef = doc(collectionRef, documentId);
    const subcollectionRef = collection(documentRef, subcollectionName);
    const subdocumentRef = doc(subcollectionRef, subdocumentId);
    return await setDoc(subdocumentRef, data);
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

  async addDocumentToSubcollection(
    mainCollectionName: string,
    mainDocumentId: string,
    subcollectionName: string,
    data: any
  ): Promise<void> {
    try {
      // Reference to the main document
      const mainDocRef = doc(this.database, mainCollectionName, mainDocumentId);

      // Reference to the subcollection
      const subcollectionRef = collection(mainDocRef, subcollectionName);

      // Generate a new document reference with a unique ID
      const newDocRef = doc(subcollectionRef);

      // Set the document data (this will create the subcollection if it doesn't exist)
      await setDoc(newDocRef, data);

      console.log('Document added successfully to subcollection');
    } catch (error) {
      console.error('Error adding document to subcollection:', error);
      throw error;
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
