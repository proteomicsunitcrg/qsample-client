export class UserCreation {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  groupp: string;

  constructor(firstname: string, lastname: string, username: string, password: string, groupp: string = null) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    this.groupp = groupp;
  }
}
