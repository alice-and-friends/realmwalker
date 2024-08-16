import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import {UserService} from "./user.service";

export enum SoundAsset {
  Click = 'click-1.mp3',
  Trade = 'coins-2.mp3',
  Error = 'error.mp3',
}

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private currentlyPlaying: boolean = false;

  constructor(private userService: UserService) {
    void this.preloadSounds();
  }

  private async preloadSounds() {
    await this.preload(SoundAsset.Click, SoundAsset.Click)
    await this.preload(SoundAsset.Trade, SoundAsset.Trade)
    await this.preload(SoundAsset.Error, SoundAsset.Error)
    console.info('Preloaded sound assets.')
  }

  async preload(assetId: SoundAsset, assetPath: string) {
    try {
      await NativeAudio.preload({
        assetId,
        assetPath,
      });
    } catch (error) {
      console.error('Error preloading sound:', error);
    }
  }

  async playSound(assetId: SoundAsset) {
    if (!this.isSoundEnabled()) {
      return;
    }
    if (this.currentlyPlaying) {
      return;
    }
    this.currentlyPlaying = true;
    try {
      await NativeAudio.play({ assetId });
    } catch (error) {
      console.error('Error playing sound:', error);
    } finally {
      this.currentlyPlaying = false;
    }
  }

  isSoundEnabled() {
    return this.userService.activeUser?.preferences['sound'];
  }
}
