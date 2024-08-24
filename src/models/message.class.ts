import { User } from './user.class';
import { v4 as uuidv4 } from 'uuid';

export class Message {
  constructor(
    public id: string = "",
    public content: string = "",
    public sender: User = new User(),
    public timestamp: Date = new Date(),
    public isRead: boolean = false
  ) {
    this.id = uuidv4();
  }

  toJson(): any {
    return {
      id: this.id,
      content: this.content,
      sender: this.sender.toJson(),
      timestamp: this.timestamp.toISOString(),
      isRead: this.isRead
    };
  }
}
