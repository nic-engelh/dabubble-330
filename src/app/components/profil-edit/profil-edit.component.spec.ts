import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEditComponent } from './profil-edit.component';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

describe('ProfilEditComponent', () => {
  let component: ProfilEditComponent;
  let fixture: ComponentFixture<ProfilEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilEditComponent, Firestore, Auth]

    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
