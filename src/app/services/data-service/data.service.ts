import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore';
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private database: Firestore) { }

  // Method to set a document in Firestore
  setDocument(collectionPath: string, docId: string, data: any): Observable<void> {
    const docRef = doc(this.database, `${collectionPath}/${docId}`);
    return from(setDoc(docRef, data));
  }

   // Method to get a document from Firestore
   getDocument(collectionPath: string, docId: string): Observable<DocumentData | undefined> {
    const docRef = doc(this.database, `${collectionPath}/${docId}`);
    return from(getDoc(docRef).then((snapshot) => snapshot.data()));
  }
}
