import { NgModule } from '@angular/core';
import { WetlabPlotComponent } from './wetlab/wetlab-plot/wetlab-plot.component';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [ CommonModule ],
    declarations: [WetlabPlotComponent],
    exports: [WetlabPlotComponent]
})
export class SharedModule { }