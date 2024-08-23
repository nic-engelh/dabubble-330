import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMessengerComponent } from './test-messenger.component';

describe('TestMessengerComponent', () => {
  let component: TestMessengerComponent;
  let fixture: ComponentFixture<TestMessengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMessengerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
