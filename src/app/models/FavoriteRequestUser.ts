import { FavoriteRequest } from "./FavoriteRequest";
import { User } from "./User";

export class FavoriteRequestUser {

    id: number;
    favoriteRequest: FavoriteRequest;
    notify: boolean;

    constructor(id: number, favoriteRequest: FavoriteRequest, notify: boolean) {
        this.id = id;
        this.favoriteRequest = favoriteRequest;
        this.notify = notify;
    }
}
