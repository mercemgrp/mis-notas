/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fancyAnimation } from './core/animations';
import { ConfigService } from './core/services/config.service';
import { MyNotesService } from './core/services/my-notes.service';
import { CoreModule } from './core/core.module';

class MyHammberConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pinch: { enable: false },
    rotate: { enable: false },
    pan: { enable: false }
  };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function initConfig(conf: ConfigService, myNotes: MyNotesService) {
  return () =>
    conf
      .loadConfig()
      .then(() => myNotes.load())
      .then(() => true);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({
      navAnimation: fancyAnimation
    }),
    HammerModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConfigService,
    MyNotesService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService, MyNotesService],
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammberConfig
    },
    Keyboard,
    FileChooser,
    Base64,
    FilePath,
    ImagePicker,
    Camera,
    File,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
