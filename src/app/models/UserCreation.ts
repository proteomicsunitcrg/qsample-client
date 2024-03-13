export class UserCreation {
  firstname: string;
  lastname: string;
  username: string;
  password: string;

  constructor(firstname: string, lastname: string, username: string, password: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
  }
}
