import { Plot } from './Plot';
import { Guideset } from './Guideset';

export class WetLab {
  id: number;
  apiKey: string;
  name: string;
  plot: Plot[];
  guideset: Guideset;
  categoryId: number;

  constructor(id: number, apiKey: string, name: string, plot: Plot[], categoryId: number) {
    this.id = id;
    this.apiKey = apiKey;
    this.name = name;
    this.plot = plot;
    this.categoryId = categoryId;
  }
}
