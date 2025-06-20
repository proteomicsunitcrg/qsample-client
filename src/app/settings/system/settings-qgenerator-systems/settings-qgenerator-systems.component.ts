import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InstrumentService } from 'src/app/services/instrument.service';
// import { QGeneratorService } from '../../../services/qGenerator.service';
import { Instrument } from '../../../models/Instrument';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-qgenerator-systems',
  templateUrl: './settings-qgenerator-systems.component.html',
  styleUrls: ['./settings-qgenerator-systems.component.css'],
})
export class SettingsQgeneratorSystemsComponent implements OnInit {
  constructor(
    private instrumentService: InstrumentService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllInstruments();
  }

  private getAllInstruments(): void {
    this.instrumentService.getAll().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public newSystem(): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', 'new']);
  }

  public edit(system: Instrument): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', system.id]);
  }
}
