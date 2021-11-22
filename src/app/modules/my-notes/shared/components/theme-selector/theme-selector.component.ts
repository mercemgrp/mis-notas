
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit{
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
