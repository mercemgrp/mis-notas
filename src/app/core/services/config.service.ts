import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ThemeUi, Configuration, Theme } from '../../shared/models/configuration-ui';
import { MODES } from '../../shared/constants/modes';
import { COLORS } from '../../shared/constants/colors';
import { StaticUtilsService } from './static-utils.service';

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
  get defaultThemeIdData(): ThemeUi {
    return this.getThemeData(this.config.defaultThemeId);
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

  getThemeData(id): ThemeUi {
    return this.getThemesData().find(c => c.themeId === id);
  }

  getThemesData(): ThemeUi[] {
    return this.config.themes.map(theme => ({
      ...theme,
      c1: COLORS[theme.colorId]?.c1,
      c2: COLORS[theme.colorId]?.c2
    }));
  }

  switchTheme(themeId, ascendant): Promise<ThemeUi[]> {
    const i = this.config.themes.findIndex(th => th.themeId === themeId);
    const switchI = ascendant ? i - 1 : i + 1;
    if (i > -1 && switchI > -1 && switchI < this.config.themes.length) {
      const note1 = {...this.config.themes[i]};
      const note2 = {...this.config.themes[switchI]};
      const config = {...this.config};
      config.themes[i] = note2;
      config.themes[switchI]=note1;
      return this.storage.set(CONFIG_KEY,config)
        .then(resp => {
          this.config = resp;
          return this.getThemesData();
        });
    } else {
      return new Promise(resolve => resolve(this.getThemesData()));
    }
  }

  setThemesData(data) {
    const themes = [...this.config.themes];
    const entries = Object.entries(data);
    entries.forEach(entry => {
      const currentTheme = themes.find(theme => theme.themeId === entry[0]);
      if (currentTheme) {
        currentTheme.themeTitle = entry[1] as string;
      } else {
        themes.push({
          themeId: StaticUtilsService.getRandomId(),
          colorId: entry[0],
          themeTitle: entry[1] as string
        });
      }

    });
    return this.storage.set(CONFIG_KEY,{...this.config, themes})
      .then(resp => this.config = resp);
  }

  private getConfigData() {
    const defaultThemesData: Theme[] = [{
      themeId: COLORS.blue.colorId,
      colorId: COLORS.blue.colorId,
      themeTitle: ''
    }, {
      themeId: COLORS.red.colorId,
      colorId: COLORS.red.colorId,
      themeTitle: ''
    }, {
      themeId: COLORS.pink.colorId,
      colorId: COLORS.pink.colorId,
      themeTitle: ''
    }, {
      themeId: COLORS.yellow.colorId,
      colorId: COLORS.yellow.colorId,
      themeTitle: ''
    }];
    return this.storage.get(CONFIG_KEY).then(
      (resp: Configuration) => {
        this.config = {
          mode: resp?.mode || MODES.deviceDefault,
          defaultThemeId: resp?.defaultThemeId || COLORS.yellow.colorId,
          themes: resp?.themes || defaultThemesData,
          fontSize: resp?.fontSize || 16
        };
        return this.config;
      }
    );
  }
}
