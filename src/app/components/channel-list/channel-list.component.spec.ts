import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListComponent } from './channel-list.component';
import { ChannelService } from '../../services/channel-service/channel.service';

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelListComponent],
      providers: [ChannelService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
