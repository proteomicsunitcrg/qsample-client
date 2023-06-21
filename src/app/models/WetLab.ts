import { Plot } from './Plot';
import { Guideset } from './Guideset';
import { WetlabCategory } from './WetlabCategory';

export class WetLab {
  id: number;
  apiKey: string;
  name: string;
  plot: Plot[];
  guideset: Guideset;
  category: WetlabCategory;

  constructor(id: number, apiKey: string, name: string, plot: Plot[], category: WetlabCategory) {
    this.id = id;
    this.apiKey = apiKey;
    this.name = name;
    this.plot = plot;
    this.category = category;
  }
}
