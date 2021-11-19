import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilsService } from '../../services/utils.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isDarkMode: boolean;
  error: boolean;
  currentFontSize;
  constructor(
    private menu: MenuController,
    private configService: ConfigService,
    private router: Router,
    private utils: UtilsService) { }

    ngOnInit() {
      this.isDarkMode = this.configService.isDarkMode;
      this.currentFontSize = this.configService.fontSize;
    }

  onCloseMainMenu() {
    this.menu.close('mainMenu');
  }

  onFontSizeRangeChanges($event) {
    this.configService.changeFontSize($event.detail.value)
      .then(fontSize => this.currentFontSize = fontSize)
      .catch(() => this.utils.showToast('Ha ocurrido un error cambiando la fuente', true));
  }

  onToggleNightMode() {
    this.configService.toggleMode().finally(() => this.isDarkMode = this.configService.isDarkMode);
  }

  onNavigateToThemesPage() {
    this.router.navigate(['settings/colors']).finally(() => this.onCloseMainMenu());
  }

}

