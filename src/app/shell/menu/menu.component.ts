import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ConfigService } from 'src/app/shared/services/config.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isDarkMode: boolean;
  error: boolean;
  constructor(
    private menu: MenuController,
    private configService: ConfigService) { }

    ngOnInit() {
      this.isDarkMode = this.configService.isDarkMode;
    }

  onCloseMainMenu() {
    this.menu.close('mainMenu');
  }

  onToggleNightMode() {
    this.configService.toggleMode().catch(_ => this.isDarkMode = this.configService.isDarkMode);
  }

}

