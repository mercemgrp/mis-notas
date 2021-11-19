import { MODES } from '../constants/modes';


export interface Configuration {
  mode: MODES;
  defaultThemeId: string;
  themes: Theme[];
  fontSize: number;
}

export interface ColorConfig {
  colorId: string;
  c1: string;
  c2: string;
}

export interface Theme {
  themeId: string;
  colorId: string;
  themeTitle: string;
}

export interface ThemeUi extends Theme{
  c1: string;
  c2: string;
}
