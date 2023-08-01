import { Component, OnInit } from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
})
export class LaunchPage {

  constructor(public auth: AuthService, public userService: UserService) { }

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home',
      },
    });
  }

  protected readonly document = document;
}
