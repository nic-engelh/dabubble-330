import { User } from './user.class';
import { Message } from './message.class';
import { Conversation } from './conversation.class';
import { v4 as uuidv4 } from 'uuid';


export class Channel {

    constructor(
      public id: string = "",
      public name: string = "",
      public description: string = "",
      public member: User[] = [],
      public messages: Message[] = [],
      public conversations: Conversation[] = [],
      public createdBy: User[] = [],
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date(),

    ) {
      this.id = uuidv4();
    }

    toJson(): any {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        member: this.member.map(m => m.toJson()),
        messages: this.messages.map(m => m.toJson()),
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
      };
    }

    updateTimestamp () {
      this.updatedAt = new Date();
    }
  }




