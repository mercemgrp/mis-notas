import { MODES } from '../constants/modes';


export interface Configuration {
  mode: MODES;
  defaultColor: string;
  colors: {id: string; title: string;}[];
  fontSize: number;
}

export interface ColorConfig {
  id: string;
  c1: string;
  c2: string;
}

export interface ColorUi {
  id: string;
  title: string;
  c1: string;
  c2: string;
}
