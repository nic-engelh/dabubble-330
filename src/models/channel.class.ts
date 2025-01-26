import { User } from './user.class';
import { Message } from './message.class';
import { Conversation } from './conversation.class';
import { v4 as uuidv4 } from 'uuid';


export class Channel {

    constructor(
      public id: string = "",
      public name: string = "",
      public description: string = "",
      public members: User[] = [],
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
        member: this.members.map(m => m.toJson()),
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
      };
    }

    updateTimestamp () {
      this.updatedAt = new Date();
    }

    addMember(user: User): void {
      if (!this.members.includes(user)) {
        this.members.push(user);
      }
    }

    removeMember(user: User): void {
      this.members = this.members.filter(member => member !== user);
    }

    updateMembers(newMember: User): void {
      this.members.push(newMember);
    }
  }




