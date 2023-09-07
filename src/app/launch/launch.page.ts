import { Component, OnInit } from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {UserService} from "../services/user.service";
import {LocationService} from "../services/location.service";

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
})
export class LaunchPage {

  constructor(public auth: AuthService, public userService: UserService, public location: LocationService) { }

  handleLogin(): void {
    if (!this.location.permissionsGranted()) {
      alert("Unable to log in. Please check location permissions.");
      return;
    }
    this.auth.loginWithRedirect({
      appState: {
        target: '/home',
      },
    });
  }

  protected readonly document = document;
}
