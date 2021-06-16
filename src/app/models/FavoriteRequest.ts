export class FavoriteRequest {

    id: number;
    agendoId: number;
    requestCode: string;

    constructor(id: number, agendoId: number, requestCode: string) {
        this.id = id;
        this.agendoId = agendoId;
        this.requestCode = requestCode;
    }
}