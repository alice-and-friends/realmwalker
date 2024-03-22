import { Directive } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ApiService} from "../../../services/api.service";
import {NotificationService} from "../../../services/notification.service";

@Directive() // Using @Directive() since Angular doesn't allow @Component on abstract classes
export abstract class AbstractLocationModalComponent {
  modal!: HTMLIonModalElement
  loading:boolean = true
  locationId!: string
  locationObject: any
  title!: string
  refreshMap!: Function

  constructor(
    protected modalCtrl: ModalController,
    protected api: ApiService,
    public notifications: NotificationService,
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  returnToMap() {
    this.modalCtrl.dismiss().catch((error) => console.error('Error closing modal', error));
  }

  abstract loadData(): void;
}
