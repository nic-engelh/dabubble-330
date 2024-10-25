import { Component, EventEmitter, Output } from '@angular/core';
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
  selectedMembers: User[] = [];


  @Output() selectedMembersChange = new EventEmitter<User[]>();

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
          console.log(results)
          // Filter out already selected members from results
          this.results = results.filter(
            member => !this.selectedMembers.some(
              selected => selected.id === member.id
            )
          );
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

  isMemberSelected(member: User): boolean {
    return this.selectedMembers.some(m => m.id === member.id);
  }

  closeDialog() {
    this.showDialog = false;
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

  // Update selectMember and removeMember methods:
  selectMember(member: User) {
    if (!this.isMemberSelected(member)) {
      this.selectedMembers.push(member);
      this.selectedMembersChange.emit(this.selectedMembers);
      this.searchTerm = '';
      this.closeDialog();
    }
  }

  removeMember(member: User) {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== member.id);
    this.selectedMembersChange.emit(this.selectedMembers);
  }

  focusInput() {
    const input = document.querySelector('.token-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

}
