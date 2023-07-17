import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { GameData } from "./models/game-data";

const STORAGE_KEY = 'idle'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private data = new GameData();

  constructor(private storage: Storage) {}

  // init is called from app.component.ts
  async init() {
    const storage = await this.storage.create();
    await storage.defineDriver(CordovaSQLiteDriver)
    this._storage = storage;
    const dataFromStorage = await this._storage.get(STORAGE_KEY);
    if(dataFromStorage === null) {
      // Start from scratch
      this.data = new GameData();
    }
    else {
      // Migrate
      this.data = Object.assign(new GameData(), dataFromStorage);
    }
    // Commit
    this._storage?.set(STORAGE_KEY, this.data);
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    try {
      // @ts-ignore
      this.data[key] = value;
      this._storage!.set(STORAGE_KEY, this.data);
    }
    catch (err) {
      console.error(err);
    }
  }
  public getData() {
    return this.data;
  }
}
