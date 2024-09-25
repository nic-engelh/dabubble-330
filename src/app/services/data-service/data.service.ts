import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import {
  collection,
  deleteDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { Observable, Subscriber } from 'rxjs';
import { Message } from '../../../models/message.class';
import { User } from '../../../models/user.class';

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

  // Neu: Dokument in Subcollection aktualisieren
  // async updateDocumentInSubcollection(
  //   collectionName: string,
  //   documentId: string,
  //   subcollectionName: string,
  //   subdocumentId: string,
  //   data: any
  // ): Promise<void> {
  //   try {
  //     const collectionRef = collection(this.database, collectionName);
  //     const documentRef = doc(collectionRef, documentId);
  //     const subcollectionRef = collection(documentRef, subcollectionName);
  //     const subdocumentRef = doc(subcollectionRef, subdocumentId);

  //     const docSnap = await getDoc(subdocumentRef);
  //     if (!docSnap.exists()) {
  //       console.error('Dokument existiert nicht:', subdocumentId);
  //       return;
  //     }

  //     await setDoc(subdocumentRef, data, { merge: true });
  //     console.log('Document successfully updated');
  //   } catch (error) {
  //     console.error('Fehler beim Aktualisieren des Dokuments:', error);
  //   }
  // }

  // async updateDocumentInSubcollection(
  //   collectionName: string,
  //   documentId: string,
  //   subcollectionName: string,
  //   subdocumentId: string,
  //   data: any
  // ): Promise<void> {
  //   try {
  //     const collectionRef = collection(this.database, collectionName);
  //     const documentRef = doc(collectionRef, documentId);
  //     const subcollectionRef = collection(documentRef, subcollectionName);
  //     const subdocumentRef = doc(subcollectionRef, subdocumentId);

  //     // Füge ein Debugging-Log hinzu
  //     console.log('Updating document with ID:', subdocumentId);
  //     console.log('Data to update:', data);

  //     // Nutze `merge: true`, um die bestehenden Felder zu aktualisieren
  //     await setDoc(subdocumentRef, data, { merge: true });
  //     console.log('Document successfully updated');
  //   } catch (error) {
  //     console.error('Fehler beim Aktualisieren des Dokuments:', error);
  //   }
  // }

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
}
