
import { DataService } from '../data-service/data.service';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User } from '../../../models/user.class';


@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private ds: DataService) { }

  private firestore: Firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'members';
  private readonly SEARCH_LIMIT = 10;

  /**
   * Search for members by name
   * @param searchTerm The search term to query
   * @returns Observable of Member array
   */
  searchMembers(searchTerm: string): Observable<User[]> {
    const searchTermLower = searchTerm.toLowerCase();
    // Create query constraints
    const constraints: QueryConstraint[] = [
      // Firebase requires a compound query to use inequality filters
      where('searchName', '>=', searchTermLower),
      where('searchName', '<=', searchTermLower + '\uf8ff'),
      orderBy('searchName'),
      limit(this.SEARCH_LIMIT)
    ];
    // Create and execute query
    const membersQuery = query(
      collection(this.firestore, this.COLLECTION_NAME),
      ...constraints
    );
    // Convert promise to observable and map the results
    return from(
      getDocs(membersQuery).then(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()

        } as User))
      )
    );
  }

  /**
   * Get a single member by ID
   * @param id Member ID
   * @returns Observable of Member
   */
  getMemberById(id: string): Observable<User | null> {
    return from(
      getDocs(
        query(
          collection(this.firestore, this.COLLECTION_NAME),
          where('id', '==', id),
          limit(1)
        )
      ).then(snapshot => {
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as User;
      })
    );
  }



}
