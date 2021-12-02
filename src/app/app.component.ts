import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ConfigService } from './core/services/config.service';
import { map, takeUntil } from 'rxjs/operators';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  constructor(
    private platform: Platform,
    private configService: ConfigService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.subscribeConfigurationChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        // StatusBar.hide();
        StatusBar.setOverlaysWebView({overlay: false});
        LocalNotifications.addListener('localNotificationActionPerformed', (payload: ActionPerformed) => {
          this.router.navigate(['my-notes/view/' + payload.notification.extra.id]);
        });
      }
    });
  }

  private subscribeConfigurationChanges() {
    this.configService.modeChanges$
    .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(map(() => this.changeMode()))
      .subscribe();
  }

  private changeMode() {
    if (this.configService.isDarkMode !== undefined) {
      if (Capacitor.isNativePlatform()) {
        this.updateStatusBar();
      } else {
        this.setMode();
      }
    }
  }

  private updateStatusBar() {
    StatusBar.getInfo().then(info => {
      if (!info.visible) {
        StatusBar.show();
      }
      const color = this.configService.isDarkMode ? '#222428' : '#364672';
      StatusBar.setBackgroundColor({color});
      this.setMode();
    });
  }

  private setMode() {
    if (this.configService.isDarkMode) {
      if (!document.body.classList.contains('dark')) {
        document.body.classList.add('dark');
      }
    } else {
      document.body.classList.remove('dark');
    }
  }
}

