export class User {
    id: number;
    apiKey: string;
    firstname: string;
    lastname: string;
    username: string;
    agendoId: number;
    roles: { id: number, name: string, roleString: string }[];

    constructor(id: number, apiKey: string, firstname: string, lastname: string, username: string, agendoId: number) {
        this.id = id;
        this.apiKey = apiKey;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.agendoId = agendoId;
    }
}
