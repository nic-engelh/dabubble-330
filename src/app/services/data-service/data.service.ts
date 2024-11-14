import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { collection, arrayUnion, arrayRemove, DocumentData, getDocs } from 'firebase/firestore';
import { Observable, Subscriber } from 'rxjs';
import { Message } from '../../../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private database: Firestore = inject(Firestore);

  async setDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await setDoc(documentRef, data);
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await updateDoc(documentRef, data);
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

  getCollectionUpdates(
    // Function parameter that takes the name of the Firestore collection as a string.
    collectionName: string
    // The function returns an Observable, a part of RxJS for handling asynchronous data streams.
  ): Observable<any> {
    // Creates a new Observable that takes a subscriber as a parameter.
    return new Observable((Subscriber) => {
      // Get a reference to the Firestore collection using the provided collection name.
      const collectionRef = collection(this.database, collectionName);
      // Listen for real-time updates from Firestore using onSnapshot.
      onSnapshot(
        // The reference to the Firestore collection.
        collectionRef,
        // Success callback: Fires whenever the collection changes.
        (querySnap) => {
          // Maps over the documents in the query snapshot.
          const data = querySnap.docs.map((docSnap) => ({
            // Extracts the document ID.
            id: docSnap.id,
            // Spreads the document data into the object.
            ...docSnap.data(),
          }));
          // Emits the data to the observable subscribers.
          Subscriber.next(data);
          // Logs the entire query snapshot to the console for debugging purposes.
          // console.log(querySnap);
        },
        // Error callback: Emits an error to the observable subscribers if the onSnapshot fails.
        (error) => Subscriber.error(error)
      );
    });
  }

  getSubcollectionUpdates(
    mainCollectionName: string,
    mainDocumentId: string,
    subCollectionName: string
  ): Observable<any> {
    const subcollectionRef = collection(
      this.database,
      `${mainCollectionName}/${mainDocumentId}/${subCollectionName}`
    );
    return new Observable((Subscriber) => {
      onSnapshot(
        subcollectionRef,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          }));
          Subscriber.next(data);
        },
        (error) => Subscriber.error(error)
      );
    });
  }

  //todo Testing if array elements will be added
  async updateArrayInCollection(
    docId: string,
    collectionName: string,
    arrayName: string,
    newArrayElement: any
  ): Promise<void> {
    const docRef = doc(
      this.database,
      `${collectionName}/${docId}`
    );
    try {
      return await updateDoc(docRef, {
        [arrayName]: arrayUnion(newArrayElement),
      });
    } catch (error: any) {
      return error;
    }
  }

  getDocumentRealTimeUpdates(mainCollectionName: string, mainDocumentId: string): Observable<DocumentData | undefined> {

    const documentRef = doc(this.database, `${mainCollectionName}/${mainDocumentId}`);

    return new Observable<DocumentData | undefined>((observer) => {
      const unsubscribe = onSnapshot(documentRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next(docSnap.data()); // Emit docuemtn data on each update
        } else {
          observer.next(undefined) // Emit undefined if document does not exist
        }
      }, (error) => {
        observer.error(error); // Pass error to observer
      });
      return () => unsubscribe();
    })
  }

  /**
   * Retrieves all documents from a Firestore collection.
   * 
   * @param collectionName The name of the collection to retrieve documents from.
   * @returns A promise that resolves with an array of documents, where each document is an object with an `id` property and the document data.
   */
  async getAllDocumentsFromCollection(collectionName: string): Promise<any[]> {
      const collectionRef = collection(this.database, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return documents;
    }
}
