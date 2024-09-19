import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  private router = inject(Router);
  error:string = "";

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras.state?.['error'] as string || 'Unknown error';
  }

}
