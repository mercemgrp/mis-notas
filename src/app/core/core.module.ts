import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
