import { User } from './user.class';
import { Message } from './message.class';
import { v4 as uuidv4 } from 'uuid';

export class Conversation {
  constructor(
    public id: string = "",
    public name: string = "",
    public participants: User[] = [],
    public creator: User = new User,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public firstMessage?: Message,
    public numberOfMessages: number = 0,
  ) {
    this.id = uuidv4();
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants.map(p => p.toJson()),
      creator: this.creator.toJson(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      firstMessage: this.firstMessage ? this.firstMessage.toJson() : null,
      numberOfMessages: this.numberOfMessages
    };
  }
}
