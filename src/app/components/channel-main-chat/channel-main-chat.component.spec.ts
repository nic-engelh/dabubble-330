import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMainChatComponent } from './channel-main-chat.component';

describe('ChannelMainChatComponent', () => {
  let component: ChannelMainChatComponent;
  let fixture: ComponentFixture<ChannelMainChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMainChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelMainChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
