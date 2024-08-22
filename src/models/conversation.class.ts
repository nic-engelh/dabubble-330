import { User } from './user.class';
import { Message } from './message.class';

export class Conversation {
  constructor(
    public id: string = "",
    public participants: User[] = [],
    public messages: Message[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public lastMessage?: Message
  ) {}

  toJson(): any {
    return {
      id: this.id,
      participants: this.participants.map(p => p.toJson()),
      messages: this.messages.map(m => m.toJson()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastMessage: this.lastMessage ? this.lastMessage.toJson() : undefined
    };
  }
}
