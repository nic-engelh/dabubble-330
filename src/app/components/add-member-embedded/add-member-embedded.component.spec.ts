import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberEmbeddedComponent } from './add-member-embedded.component';

describe('AddMemberEmbeddedComponent', () => {
  let component: AddMemberEmbeddedComponent;
  let fixture: ComponentFixture<AddMemberEmbeddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMemberEmbeddedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberEmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
