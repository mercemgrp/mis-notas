import { COLORS } from '../constants/colors';
import { MODES } from '../constants/modes';


export interface Configuration {
  mode: MODES;
  defaultColor: COLORS;
  colors: {id: string; title: string}[];
}
