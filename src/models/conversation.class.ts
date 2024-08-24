import { User } from './user.class';
import { Message } from './message.class';
import { v4 as uuidv4 } from 'uuid';

export class Conversation {
  constructor(
    public id: string = "",
    public name: string = "",
    public participants: User[] = [],
    public messages: Message[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public lastMessage?: Message
  ) {
    this.id = uuidv4();
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants.map(p => p.toJson()),
      messages: this.messages.map(m => m.toJson()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastMessage: this.lastMessage ? this.lastMessage.toJson() : null
    };
  }
}
