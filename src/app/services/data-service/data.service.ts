import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import {
  collection,
  deleteDoc,
  arrayUnion, arrayRemove, DocumentData, getDocs,

} from 'firebase/firestore';
import { Observable, Subscriber } from 'rxjs';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  /**
   * The Firestore database instance.
   * @private
   * @type {Firestore}
   */
  private database: Firestore = inject(Firestore);

  /**
   * Sets a document in a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} documentId - The ID of the document.
   * @param {any} data - The data to be set in the document.
   * @returns {Promise<void>} - A promise that resolves when the document is set.
   */
  async setDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await setDoc(documentRef, data);
  }

  /**
  * Updates a document in a specified collection.
  * @param {string} collectionName - The name of the collection.
  * @param {string} documentId - The ID of the document.
  * @param {any} data - The data to be updated in the document.
  * @returns {Promise<void>} - A promise that resolves when the document is updated.
  */
  async updateDocument(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    const documentRef = doc(this.database, collectionName, documentId);
    await updateDoc(documentRef, data);
  }

  /**
     * Sets a document in a subcollection.
     * @param {string} collectionName - The name of the main collection.
     * @param {string} documentId - The ID of the main document.
     * @param {string} subcollectionName - The name of the subcollection.
     * @param {string} subdocumentId - The ID of the subdocument.
     * @param {any} data - The data to be set in the subdocument.
     * @returns {Promise<any>} - A promise that resolves with the result of the operation.
     */
  async documentExistsInSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subdocumentId: string
  ): Promise<boolean> {
    const collectionRef = collection(this.database, collectionName);
    const documentRef = doc(collectionRef, documentId);
    const subcollectionRef = collection(documentRef, subcollectionName);
    const subdocumentRef = doc(subcollectionRef, subdocumentId);

    const docSnap = await getDoc(subdocumentRef);
    return docSnap.exists(); // Gibt true zurück, wenn das Dokument existiert
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

  /**
   * Retrieves a document from a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} documentId - The ID of the document.
   * @returns {Promise<any>} - A promise that resolves with the document data.
   * @throws {Error} - If the document does not exist.
   */
  async getDocument(collectionName: string, documentId: string): Promise<any> {
    const documentRef = doc(this.database, collectionName, documentId);
    const documentSnapshot = await getDoc(documentRef);
    if (documentSnapshot.exists()) {
      return documentSnapshot.data();
    } else {
      throw new Error('Document does not exist');
    }
  }

  /**
  * Adds a document to a subcollection.
  * @param {string} mainCollectionName - The name of the main collection.
  * @param {string} mainDocumentId - The ID of the main document.
  * @param {string} subcollectionName - The name of the subcollection.
  * @param {any} data - The data to be added to the subcollection.
  * @returns {Promise<void>} - A promise that resolves when the document is added.
  * @throws {Error} - If adding the document fails.
  */
  async addDocumentToSubcollection(
    mainCollectionName: string,
    mainDocumentId: string,
    subcollectionName: string,
    subDocId: string,
    data: any,
  ): Promise<void> {
    try {
      // Reference to the main document
      const mainDocRef = doc(this.database, mainCollectionName, mainDocumentId);
      // Reference to the subcollection
      const subcollectionRef = collection(mainDocRef, subcollectionName);
      // Generate a new document reference with a unique ID
      const newDocRef = doc(subcollectionRef, subDocId);
      // Set the document data (this will create the subcollection if it doesn't exist)
      await setDoc(newDocRef, data);
      console.log('Document added successfully to subcollection');
    } catch (error) {
      console.error('Error adding document to subcollection:', error);
      throw error;
    }
  }

/**
 * Adds a document to a sub-subcollection within a Firestore database.
 *
 * @param {string} mainCollectionName - The name of the main collection.
 * @param {string} mainDocumentId - The ID of the document within the main collection.
 * @param {string} subcollectionName - The name of the subcollection.
 * @param {string} subDocId - The ID of the document within the subcollection.
 * @param {string} subSubCollectionName - The name of the sub-subcollection.
 * @param {string} subSubDocId - The ID of the document within the sub-subcollection.
 * @param {any} data - The data to be written to the document.
 * @returns {Promise<void>} A promise that resolves when the document is added successfully.
 */
  async addDocumentToSubSubcollection(
    mainCollectionName: string,
    mainDocumentId: string,
    subcollectionName: string,
    subDocId: string,
    subSubCollectionName: string,
    subSubDocId: string,
    data: any,
  ): Promise<void> {
    try {
      // Reference to the collecition wihtin Subcollection
      const subSubDocRef = doc(this.database, mainCollectionName, mainDocumentId, subcollectionName, subDocId, subSubCollectionName, subSubDocId);
      await setDoc(subSubDocRef, data);
      console.log('Document added successfully to subcollection');
    } catch (error) {
      console.error('Error adding document to subcollection:', error);
      throw error;
    }
  }

  /**
   * Retrieves updates from a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @returns {Observable<any>} - An observable that emits updates from the collection.
   */
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

  /**
   * Retrieves updates from a specified subcollection.
   * @param {string} mainCollectionName - The name of the main collection.
   * @param {string} mainDocumentId - The ID of the main document.
   * @param {string} subCollectionName - The name of the subcollection.
   * @returns {Observable<any>} - An observable that emits updates from the subcollection.
   */
  async updateDocumentInSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subdocumentId: string, // Hier sicherstellen, dass die gleiche ID verwendet wird
    data: any
  ): Promise<void> {
    try {
      const collectionRef = collection(this.database, collectionName);
      const documentRef = doc(collectionRef, documentId);
      const subcollectionRef = collection(documentRef, subcollectionName);
      const subdocumentRef = doc(subcollectionRef, subdocumentId);

      // Überprüfen, ob das Dokument existiert
      const docSnap = await getDoc(subdocumentRef);
      if (!docSnap.exists()) {
        console.error('Dokument existiert nicht:', subdocumentId);
        return; // Falls es nicht existiert, kein neues Dokument erstellen
      }

      // Update das Dokument mit { merge: true }, um nur die Felder zu aktualisieren
      await setDoc(subdocumentRef, data, { merge: true });
      console.log('Document successfully updated');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  }

  // Neu: Dokument aus Subcollection löschen
  async deleteDocumentFromSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subdocumentId: string
  ): Promise<void> {
    const subdocumentRef = doc(
      this.database,
      `${collectionName}/${documentId}/${subcollectionName}/${subdocumentId}`
    );
    await deleteDoc(subdocumentRef);
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

  /**
   * Updates an array in a document within a specified collection.
   * @param {string} docId - The ID of the document.
   * @param {string} collectionName - The name of the collection.
   * @param {string} arrayName - The name of the array field.
   * @param {any} newArrayElement - The new element to add to the array.
   * @returns {Promise<void>} - A promise that resolves when the array is updated.
   * @throws {Error} - If updating the array fails.
   */
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

  /**
   * Retrieves real-time updates for a document.
   * @param {string} mainCollectionName - The name of the main collection.
   * @param {string} mainDocumentId - The ID of the main document.
   * @returns {Observable<DocumentData | undefined>} - An observable that emits real-time updates for the document.
   */
  getDocumentRealTimeUpdates(mainCollectionName: string, mainDocumentId: string): Observable<DocumentData | undefined> {
    const documentRef = doc(this.database, `${mainCollectionName}/${mainDocumentId}`);
    return new Observable<DocumentData | undefined>((observer) => {
      const unsubscribe = onSnapshot(documentRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next(docSnap.data()); // Emit doc data on each update
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

  /**
   * Deletes a document from a specified collection
   * @param {string} collectionName - Name of the collection
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   * @throws {FirebaseError} If deletion fails
   */
  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      const documentRef = doc(this.database, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}
