import { Plot } from './Plot';
import { Guideset } from './Guideset';
import { WetLabCategory } from './WetLabCategory';

export class WetLab {
  id: number;
  apiKey: string;
  name: string;
  plot: Plot[];
  guideset: Guideset;
  wetlabCategory: WetLabCategory;

  constructor(id: number, apiKey: string, name: string, plot: Plot[], wetlabCategory: WetLabCategory) {
    this.id = id;
    this.apiKey = apiKey;
    this.name = name;
    this.plot = plot;
    this.wetlabCategory = wetlabCategory;
  }
}
