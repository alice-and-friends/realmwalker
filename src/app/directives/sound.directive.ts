import {Directive, HostListener, Input} from '@angular/core';
import {SoundAsset, SoundService} from "../services/sound.service";

@Directive({
  selector: 'ion-button, ion-fab-button, ion-checkbox, ion-select, ion-select-option, [app-sound]',
})
export class SoundDirective {
  @Input('app-sound') sound: false|SoundAsset = SoundAsset.Click;  // Default sound

  constructor(private soundService: SoundService) {}

  @HostListener('click')
  onClick() {
    if (!this.sound) {
      return
    }
    void this.soundService.playSound(this.sound);
  }
}
