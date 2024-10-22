import { v4 as uuidv4 } from 'uuid';

export class User {

  constructor(
    public id: string = "",
    public username: string = "",
    public email: string = "",
    public avatarUrl: string | undefined = "/assets/img/profil_default_unisex.svg",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public searchName: string = "",
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
      searchName: this.username.toLowerCase(),
    };
  }

}
