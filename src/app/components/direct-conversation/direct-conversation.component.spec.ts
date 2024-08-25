import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectConversationComponent } from './direct-conversation.component';

describe('DirectConversationComponent', () => {
  let component: DirectConversationComponent;
  let fixture: ComponentFixture<DirectConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
