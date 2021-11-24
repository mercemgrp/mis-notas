import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ThemeUi, Configuration, Theme } from '../../shared/models/configuration-ui';
import { Modes } from '../../shared/constants/modes';
import { COLORS } from '../../shared/constants/colors';
import { StaticUtilsService } from './static-utils.service';
import { ViewModes } from 'src/app/shared/constants/views';

const CONFIG_KEY = 'my-notes-mmg-configuration';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get viewIsListMode(): boolean {
    return this.config.viewMode === ViewModes.list;
  }
  get selectedTheme(): ThemeUi {
    return this.getThemeData(this.config.menuId);
  }
  get hideArchived(): boolean {
    return this.config.hideArchived;
  }
  get fontSize() {
    return this.config.fontSize;
  }
  get showThemesToolbar() {
    return this.config.showThemesToolbar;
  }
  get isDarkMode() {
    if (!this.config){
      return undefined;
    }
    return this.config.mode === Modes.dark ||
    (this.config.mode === Modes.deviceDefault && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  get configuration(): Configuration {
    return this.config;
  }
  get defaultThemeIdData(): ThemeUi {
    return this.getThemeData(this.config.defaultThemeId);
  }

  modeChanges$: Observable<Modes>;
  viewModeChanges$: Observable<ViewModes>;
  private config: Configuration;
  private modeSubject =  new BehaviorSubject<Modes>(undefined);
  private viewModeSubject =  new BehaviorSubject<ViewModes>(undefined);
  constructor(private storage: Storage) {
    this.modeChanges$ = this.modeSubject.asObservable();
    this.viewModeChanges$ = this.viewModeSubject.asObservable();
    }

    toggleMode() {
      const config: Configuration = {...this.config, mode: this.isDarkMode ? Modes.light : Modes.dark};
      return this.storage.set(CONFIG_KEY,config).then(_ => {
        this.config = config;
        this.modeSubject.next(this.config.mode);
      }
      ).catch(_ =>
        this.modeSubject.next(this.config.mode)
      );
    }

    toggleViewMode() {
      const config: Configuration = {...this.config, viewMode: (this.viewIsListMode ? ViewModes.grid : ViewModes.list)};
      return this.storage.set(CONFIG_KEY,config).then(_ => {
        this.config = config;
        this.viewModeSubject.next(this.config.viewMode);
      }
      ).catch(_ =>
        this.viewModeSubject.next(this.config.viewMode)
      );
    }

    toggleHideArchived() {
      const config: Configuration = {...this.config, hideArchived: !this.config.hideArchived};
      return this.storage.set(CONFIG_KEY,config).then(_ => {
        this.config = config;
        return this.config.hideArchived;
      }
      ).catch(_ => this.config.hideArchived);
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
    return this.config.themesData.map(theme => ({
      ...theme,
      themeTitle: theme.themeTitle || '',
      c1: COLORS[theme.colorId]?.c1,
      c2: COLORS[theme.colorId]?.c2,
      basicTheme: Object.keys(COLORS).includes(theme.themeId),
    })).sort((a, b) => (a.themePosition || 0) - (b.themePosition || 0));
  }

  switchTheme(theme1Data: ThemeUi, theme2Data: ThemeUi): Promise<ThemeUi[]> {
    if (theme1Data && theme2Data) {
      const theme1Position = this.config.themesData.find(th => th.themeId === theme1Data.themeId).themePosition;
      const theme2Position = this.config.themesData.find(th => th.themeId === theme2Data.themeId).themePosition;
        const config = {...this.config};
        config.themesData.find(th => th.themeId === theme1Data.themeId).themePosition = theme2Position || 0;
        config.themesData.find(th => th.themeId === theme2Data.themeId).themePosition = theme1Position || 0;
        return this.storage.set(CONFIG_KEY,config)
          .then(resp => {
            this.config = resp;
            return this.getThemesData();
          });
      } else {
        return new Promise(resolve => resolve(this.getThemesData()));
      }
  }

  setThemeSelected(themeId) {
    return this.storage.set(CONFIG_KEY,{...this.config, menuId: themeId} as Configuration)
      .then(resp => this.config = resp);
  }

  deleteTheme(themeId) {
    return this.storage.set(CONFIG_KEY,{...this.config,
        themesData: this.config.themesData.filter(theme => theme.themeId !== themeId)} as Configuration)
      .then(resp => this.config = resp);
  }

  setShowThemeToolbar(value) {
    return this.storage.set(CONFIG_KEY,{...this.config, showThemesToolbar: value} as Configuration)
      .then(resp => this.config = resp);
  }

  setThemesData(data: ThemeUi[]) {
    const themesData = [...this.config.themesData];
    data.forEach(theme => {
      const currentTheme = themesData.find(th => th.themeId === theme.themeId);
      if (currentTheme) {
        currentTheme.themeTitle = theme.themeTitle.trim();
      } else {
        themesData.push({
          themeId: StaticUtilsService.getRandomId(),
          colorId: theme.colorId,
          themeTitle:theme.themeTitle,
          themePosition: themesData.reduce((result, th) => (th.themePosition > result ? th.themePosition : result) , 0) + 1
        });
      }

    });
    return this.storage.set(CONFIG_KEY,{...this.config, themesData})
      .then(resp => this.config = resp);
  }

  private getConfigData() {
    const defaultThemesData: Theme[] = [{
      themeId: COLORS.blue.colorId,
      colorId: COLORS.blue.colorId,
      themeTitle: '',
      themePosition: 1,
    }, {
      themeId: COLORS.red.colorId,
      colorId: COLORS.red.colorId,
      themeTitle: '',
      themePosition: 2
    }, {
      themeId: COLORS.pink.colorId,
      colorId: COLORS.pink.colorId,
      themeTitle: '',
      themePosition: 3
    }, {
      themeId: COLORS.yellow.colorId,
      colorId: COLORS.yellow.colorId,
      themeTitle: '',
      themePosition: 4
    }];
    return this.storage.get(CONFIG_KEY).then(
      (resp: Configuration) => {
        this.config = {
          mode: resp?.mode || Modes.deviceDefault,
          defaultThemeId: resp?.defaultThemeId || COLORS.yellow.colorId,
          themesData: resp?.themesData || defaultThemesData,
          fontSize: resp?.fontSize || 16,
          menuId: resp?.menuId || '',
          viewMode: resp?.viewMode || ViewModes.list,
          showThemesToolbar: resp?.showThemesToolbar === false ? false : true,
          hideArchived: resp?.hideArchived || false
        };
        return this.config;
      }
    );
  }
}
