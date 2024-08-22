export class User {

  constructor(
    public id: string = "",
    public username: string = "",
    public email: string = "",
    public avatarUrl: string | undefined = "",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  toJson(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

}
