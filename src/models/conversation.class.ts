import { User } from './user.class';
import { Message } from './message.class';
import { v4 as uuidv4 } from 'uuid';

// A conversation is a selection of messages within a chat of two members. A thread is a type of conversation within a channel.
export class Conversation {

  id: string;
  name: string;
  participants: User[];
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  firstMessage?: Message;
  numberOfMessages: number;


  constructor() {
    this.id = uuidv4(),
      this.name = '',
      this.participants = [],
      this.creator = new User(),
      this.createdAt = new Date(),
      this.updatedAt = new Date(),
      this.numberOfMessages = 0
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants.map(p => p.toJson()),
      creator: this.creator?.toJson() || null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      firstMessage: this.firstMessage ? this.firstMessage.toJson() : null,
      numberOfMessages: this.numberOfMessages
    };
  }
}
