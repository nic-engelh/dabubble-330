import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilMenuComponent } from './profil-menu.component';

describe('ProfilMenuComponent', () => {
  let component: ProfilMenuComponent;
  let fixture: ComponentFixture<ProfilMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
