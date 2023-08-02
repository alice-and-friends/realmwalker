import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-character-modal',
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.scss'],
})
export class CharacterModalComponent  implements OnInit {
  inventory: any;

  constructor(private modalCtrl: ModalController, private api: ApiService, public auth: AuthService) { }

  ngOnInit() {
    console.log('boop')
    this.api.getInventory().subscribe((data: any) => {
      this.inventory = data;
    })
  }

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  protected readonly document = document;
}
