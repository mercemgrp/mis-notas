
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { COLORS } from 'src/app/shared/constants/colors';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit{
  @Output() selectColorEv = new EventEmitter<string>();
  fontSize;
  colors = [];
  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.fontSize = this.config.fontSize;
    this.colors = Object.values(COLORS);
  }


  onSelectStyle(colorId) {
    this.selectColorEv.emit(colorId);
  }


}
