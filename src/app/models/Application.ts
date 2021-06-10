import { ApplicationConstraint } from "./ApplicationConstraint";

export class Application {

  id: number;
  name: string;
  applicationConstraint: ApplicationConstraint

  constructor(id: number, name: string, applicationConstraint: ApplicationConstraint) {
    this.id = id;
    this.name = name;
    this.applicationConstraint = applicationConstraint;
  }
}
