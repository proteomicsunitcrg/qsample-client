import { User } from './User';

export class PasswordResetToken {

    id: number;
    expiryDate: Date;
    token: string;
    user: User;

    constructor(id: number, expiryDate: Date, token: string, user: User) {
        this.id = id;
        this.expiryDate = expiryDate;
        this.token = token;
        this.user = user;
    }
}