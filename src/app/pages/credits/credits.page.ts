import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage {

  constructor(public router: Router) { }

  close() {
    this.router.navigate(['/home'])
  }
}
