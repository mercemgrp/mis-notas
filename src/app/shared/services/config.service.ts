import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Configuration } from '../models/configuration-ui';
import { MODES } from '../constants/modes';

const CONFIG_KEY = 'configuration';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get isDarkMode() {
    if (!this.config){
      return undefined;
    }
    return this.config.mode === MODES.dark ||
    (this.config.mode === MODES.deviceDefault && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  get configuration(): Configuration {
    return this.config;
  }
  modeChanges$: Observable<MODES>;
  private config: Configuration;
  private modeSubject =  new BehaviorSubject<MODES>(undefined);

  constructor(private storage: Storage) {
    this.modeChanges$ = this.modeSubject.asObservable();
    }

    toggleMode() {
      const config = {...this.config, mode: this.isDarkMode ? MODES.light : MODES.dark};
      return this.storage.set(CONFIG_KEY,config).then(_ => {
        this.config = config;
        this.modeSubject.next(this.config.mode);
      }
      ).catch(_ =>
        this.modeSubject.next(this.config.mode)
      );
    }

  loadConfig() {
    return this.storage.create().then(() => this.getConfigData());
  }

  private getConfigData() {
    return this.storage.get(CONFIG_KEY).then(
      (resp: Configuration) => {
        this.config = {
          mode: resp?.mode || MODES.deviceDefault
        };
        return this.config;
      }
    );
  }
}
