import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThemesPageRoutingModule } from './themes-routing.module';

import { ThemesPage } from './themes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ThemesPageRoutingModule
  ],
  declarations: [ThemesPage]
})
export class ThemesPageModule {}
