import { Modes } from '../constants/modes';
import { ViewModes } from '../constants/views';


export interface Configuration {
  mode: Modes;
  defaultThemeId: string;
  themesData: Theme[];
  fontSize: number;
  menuId: string;
  viewMode: ViewModes;
  showThemesToolbar: boolean;
  hideArchived: boolean;
}

export interface ColorConfig {
  colorId: string;
  c1: string;
  c2: string;
  c3: string;
}

export interface Theme {
  themeId: string;
  colorId: string;
  themeTitle: string;
  themePosition: number;
}

export interface ThemeUi extends Theme{
  c1: string;
  c2: string;
  c3: string;
  basicTheme?: boolean;
}
