import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetMaillingComponent } from './reset-mailling.component';

describe('ResetMaillingComponent', () => {
  let component: ResetMaillingComponent;
  let fixture: ComponentFixture<ResetMaillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetMaillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetMaillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
