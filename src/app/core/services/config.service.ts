import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ColorUi, Configuration } from '../../shared/models/configuration-ui';
import { MODES } from '../../shared/constants/modes';
import { COLORS } from '../../shared/constants/colors';
import { Color } from 'src/app/shared/models/color';

const CONFIG_KEY = 'my-notes-mmg-configuration';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get fontSize() {
    return this.config.fontSize;
  }
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

    changeFontSize(fontSize) {
      const config = {...this.config, fontSize};
      return this.storage.set(CONFIG_KEY,config).then(_ => {
        this.config = config;
        return this.fontSize;
      }
      ).catch(_ => this.fontSize
      );
    }

  loadConfig() {
    return this.storage.create().then(() => this.getConfigData());
  }

  getColorData(id): ColorUi {
    return this.getColorsData().find(c => c.id === id);
  }

  getColorsData(): ColorUi[] {
    return this.config.colors.map(c => ({
      ...c,
      c1: COLORS[c.id]?.c1,
      c2: COLORS[c.id]?.c2
    }));
  }

  switchColor(id, ascendant): Promise<ColorUi[]> {
    const i = this.config.colors.findIndex(c => c.id === id);
    const switchI = ascendant ? i - 1 : i + 1;
    if (i > -1 && switchI > -1 && switchI < this.config.colors.length) {
      const note1 = {...this.config.colors[i]};
      const note2 = {...this.config.colors[switchI]};
      const config = {...this.config};
      config.colors[i] = note2;
      config.colors[switchI]=note1;
      return this.storage.set(CONFIG_KEY,config)
        .then(resp => {
          this.config = resp;
          return this.getColorsData();
        });
    } else {
      return new Promise(resolve => resolve(this.getColorsData()));
    }
  }

  setColorsData(data) {
    const colors = [...this.config.colors];
    const entries = Object.entries(data);
    entries.forEach(entry => {
      const currentColor = colors.find(c => c.id === entry[0]);
      if (currentColor) {
        currentColor.title = entry[1] as string;
      } else {
        colors.push({
          id: entry[0],
          title: entry[1] as string
        });
      }

    });
    return this.storage.set(CONFIG_KEY,{...this.config, colors})
      .then(resp => this.config = resp);
  }

  private getConfigData() {
    const defaultColorsData = [{
      id: COLORS.blue.id,
      title: ''
    }, {
      id: COLORS.red.id,
      title: ''
    }, {
      id: COLORS.pink.id,
      title: ''
    }, {
      id: COLORS.yellow.id,
      title: ''
    }];
    return this.storage.get(CONFIG_KEY).then(
      (resp: Configuration) => {
        this.config = {
          mode: resp?.mode || MODES.deviceDefault,
          defaultColor: resp?.defaultColor || COLORS.yellow.id,
          colors: resp?.colors || defaultColorsData,
          fontSize: resp?.fontSize || 16
        };
        return this.config;
      }
    );
  }
}
