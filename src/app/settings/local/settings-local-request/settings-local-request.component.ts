import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-local-request',
  templateUrl: './settings-local-request.component.html',
  styleUrls: ['./settings-local-request.component.css']
})
export class SettingsLocalRequestComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public newRequest(): void {
    this.router.navigate(['/settings/local/request/editor', 'new']);
  }

}
