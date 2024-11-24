import { User } from './user.class';
import { v4 as uuidv4 } from 'uuid';

export class Message {
  constructor(
    public id: string = '',
    public content: string = '',
    public sender: User = new User(),
    public timestamp: Date = new Date(),
    public isRead: boolean = false,
    public showMenu: boolean = false,
    public conversationId: string = ''
  ) {
    this.id = uuidv4();
  }

  toJson(): any {
    return {
      id: this.id,
      content: this.content,
      sender: this.sender.toJson(),
      timestamp: this.timestamp.toISOString(),
      isRead: this.isRead,
      conversationId: this.conversationId,
    };
  }
  // toJson() {
  //   return {
  //     id: this.id,
  //     content: this.content,
  //     sender: {
  //       id: this.sender.id,
  //       username: this.sender.username,
  //       email: this.sender.email,
  //       avatarUrl: this.sender.avatarUrl,
  //     },
  //     timestamp: this.timestamp.toISOString(),
  //     isRead: this.isRead,
  //     conversationId: this.conversationId,
  //   };
  // }
  static fromData(data: any): Message {
    return new Message(
      data.id,
      data.content,
      User.fromData(data.sender), // Gehe davon aus, dass der User ebenfalls eine fromData() Methode hat
      new Date(data.timestamp),
      data.isRead,
      data.showMenu,
      data.conversationId
    );
  }
}
