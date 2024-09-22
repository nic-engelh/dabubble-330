import { v4 as uuidv4 } from 'uuid';

export class User {
  constructor(
    public id: string = '',
    public username: string = '',
    public email: string = '',
    public avatarUrl: string | undefined = '',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.id = uuidv4();
  }

  toJson(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
  static fromData(data: any): User {
    return new User(data.id, data.name, data.email);
  }
}
