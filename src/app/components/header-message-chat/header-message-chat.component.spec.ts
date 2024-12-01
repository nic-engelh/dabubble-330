import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMessageChatComponent } from './header-message-chat.component';

describe('HeaderMessageChatComponent', () => {
  let component: HeaderMessageChatComponent;
  let fixture: ComponentFixture<HeaderMessageChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMessageChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderMessageChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
