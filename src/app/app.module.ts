import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fancyAnimation } from './shared/animations';
import { ConfigService } from './shared/services/config.service';
import { MyNotesService } from './shared/services/my-notes.service';
import { ShellModule } from './shell/shell.module';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function initConfig(conf: ConfigService, myNotes: MyNotesService) {
  return () => conf.loadConfig().then(() => myNotes.load()).then(() => true);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, AppRoutingModule, ShellModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot({
      navAnimation: fancyAnimation,
    }),
    HammerModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConfigService,
    MyNotesService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService, MyNotesService],
      multi: true,
    },
  Keyboard,
  FileChooser,
  Base64,
  FilePath,
  ImagePicker,
  Camera,
  File,
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerGestureConfig
}
],
  bootstrap: [AppComponent],
})
export class AppModule {}
