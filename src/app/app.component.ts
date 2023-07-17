import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(public auth: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userService.login();
  }

}
