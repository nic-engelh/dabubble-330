import { Component } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-messenger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-messenger.component.html',
  styleUrl: './test-messenger.component.scss'
})
export class TestMessengerComponent {

  data: any;

  constructor(private dataService: DataService) {}

  addData() {
    this.dataService
      .setDocument('testCollection', 'testDoc', { name: 'John Doe', age: 30 })
      .subscribe({
        next: () => console.log('Document successfully written!'),
        error: (err) => console.error('Error writing document: ', err),
      });
  }

  getData() {
    this.dataService
      .getDocument('testCollection', 'testDoc')
      .subscribe((docData) => {
        this.data = docData;
      });
  }

}
