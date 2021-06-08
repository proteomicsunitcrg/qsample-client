import { Modification } from "./Modification";

export class ModificationRelation {

  id: number;
  modification: Modification;
  value: number;

  constructor(id: number, modification: Modification, value: number) {
    this.id = id;
    this.modification = modification;
    this.value = value;
  }
}
