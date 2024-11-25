import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {

  private dialogOpenSignal = signal<boolean>(false);
  dialogOpen = this.dialogOpenSignal.asReadonly();

  private selectedItemSignal = signal<string | null>(null);
  selectedItem = this.selectedItemSignal.asReadonly();

  openDialog() {
    this.dialogOpenSignal.set(true);
  }

  closeDialog() {
    this.dialogOpenSignal.set(false);
  }

  selectItem(item: string) {
    this.selectedItemSignal.set(item);
  }


  
}
