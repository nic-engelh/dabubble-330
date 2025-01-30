import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMainChatInputComponent } from './channel-main-chat-input.component';

describe('ChannelMainChatInputComponent', () => {
  let component: ChannelMainChatInputComponent;
  let fixture: ComponentFixture<ChannelMainChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMainChatInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelMainChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
