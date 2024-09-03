import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchControl = this.searchForm.get('search');
      if (searchControl) {
        const searchValue = searchControl.value;
        console.log('Search value:', searchValue);
        // Call API or perform search action here
      }
    }
  }
}
