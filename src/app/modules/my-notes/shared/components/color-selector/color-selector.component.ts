
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { COLORS } from 'src/app/shared/constants/colors';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {
  @Output() selectThemeEv = new EventEmitter<string>();
  colors = [];
  ngOnInit() {
    const entries = Object.entries(COLORS);
    this.colors = entries.map(value =>value[1] );
  }


  onSelectStyle(colorId) {
    this.selectThemeEv.emit(colorId);
  }


}
