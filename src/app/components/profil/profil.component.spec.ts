import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilComponent } from './profil.component';
import { Firestore } from '@angular/fire/firestore';
import { UserDataService } from '../../services/user-data/user-data.service';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Auth } from '@angular/fire/auth';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilComponent],
      providers: [UserDataService, AuthenticationService, Auth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
