
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { COLORS } from 'src/app/shared/constants/colors';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit{
  @Input() currentThemeSelectedId: string;
  @Input() canAdd;
  @Output() selectThemeEv = new EventEmitter<string>();
  themes: ThemeUi[] = [];
  fontSize;
  newTheme: ThemeUi;
  themeSelectedId: string;
  idColorNewTheme = 0;
  constructor(
    private config: ConfigService,
    private utils: UtilsService) {}

  ngOnInit() {
    this.fontSize = this.config.fontSize;
    this.themes = this.config.getThemesData();
    this.newTheme = {
      themeId: StaticUtilsService.getRandomId(),
      themeTitle: '',
      ...COLORS[Object.keys(COLORS)[this.idColorNewTheme]],
      themePosition: this.themes.reduce((result, theme) =>
        (theme.themePosition > result ? theme.themePosition : result) , 0) + 1
    };
    this.themeSelectedId = this.currentThemeSelectedId;
  }


  onChangeColor() {
    this.idColorNewTheme++;
    if (Object.entries(COLORS).length === this.idColorNewTheme) {
      this.idColorNewTheme = 0;
    }
    this.newTheme = {
      ...this.newTheme,
      ...COLORS[Object.keys(COLORS)[this.idColorNewTheme]]
    };
  }

  onSelectTheme(themeId) {
    this.themeSelectedId= themeId;
  }

  onAccept() {
    if (this.themeSelectedId === this.newTheme.themeId) {
      if(!this.newTheme.themeTitle) {
        this.utils.showToast('La temática tiene que tener título', true);
      } else {
        this.config.addTheme(this.newTheme).then(id => this.selectThemeEv.emit(id));
      }
    } else {
      this.selectThemeEv.emit(this.themeSelectedId);
    }
  }

  onCancel() {
    this.selectThemeEv.emit(null);
  }



}
