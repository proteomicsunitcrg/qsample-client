import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WorkflowParsed } from 'src/app/models/WorkflowParsed';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-dashboard-request-nextflow',
  templateUrl: './dashboard-request-nextflow.component.html',
  styleUrls: ['./dashboard-request-nextflow.component.css']
})
export class DashboardRequestNextflowComponent implements OnInit {

  constructor(private fileService: FileService) { }

  columnsToDisplay = ['status', 'filename', 'duration', 'database'];

  datasource: MatTableDataSource<WorkflowParsed>;

  allWorkflowsParsed: WorkflowParsed[] = [];


  ngOnInit(): void {
    this.getWorkflows();
  }

  private getWorkflows(): void {
    this.fileService.getWorkflows().subscribe(
      res => {
        console.log(res);
        
        for (let flow of res.workflows) {
          if (flow.workflow.status === 'RUNNING') {
            // do things, means that is not completed
            this.allWorkflowsParsed.push(new WorkflowParsed(flow.workflow.start, this.parseFilenameFromPath(flow.workflow.params.rawfile), this.parseDatabaseFromFilename(this.parseFilenameFromPath(flow.workflow.params.rawfile)), flow.workflow.status));
          }
        }
        this.datasource = new MatTableDataSource(this.allWorkflowsParsed);
      },
      err => {
        console.error(err);
      }
    );
  }

  private parseFilenameFromPath(path: string): string {
    return path.split('/').pop();
  }

  private parseDatabaseFromFilename(filename: string): string {
    return filename.split('.').pop();
  }

}
