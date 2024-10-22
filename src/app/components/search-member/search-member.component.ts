import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../../models/user.class';
import { MemberService } from '../../services/member-service/member.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-member',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-member.component.html',
  styleUrl: './search-member.component.scss',
})
export class SearchMemberComponent {
  private searchSubject = new Subject<string>();
  searchTerm: string = '';
  showDialog: boolean = false;
  loading: boolean = false;
  results: User[] = [];

  constructor(private memberService: MemberService) {
    // Set up search pipeline
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term) => term.length >= 3),
        switchMap((term) => {
          this.loading = true;
          return this.memberService.searchMembers(term);
        })
      )
      .subscribe({
        next: (results) => {
          this.results = results;
          this.showDialog = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          // todo add toastservice and show error toast
          this.loading = false;
          this.results = [];
        },
      });
  }

  closeDialog() {
    this.showDialog = false;
  }

  selectMember(member: User) {
    console.log('Selected member:', member);
    // Implement your selection logic here
    // todo selected member tag is added to the search bar
    this.closeDialog();
  }

  onSearch(term: string) {
    if (term.length >= 3) {
      this.loading = true;
      this.searchSubject.next(term);
    } else {
      this.showDialog = false;
      this.results = [];
    }
  }


}
