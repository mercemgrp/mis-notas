
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit{
  @Input() themes: ThemeUi[] = [];
  @Output() selectThemeEv = new EventEmitter<string>();
  fontSize;
  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.fontSize = this.config.fontSize;
  }


  onSelectStyle(colorId) {
    this.selectThemeEv.emit(colorId);
  }


}
