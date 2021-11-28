import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThemesPageRoutingModule } from './themes-routing.module';

import { ThemesPage } from './themes.page';
import { ThemeEditorComponent } from './color-selector/theme-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ThemesPageRoutingModule,
    SharedModule
  ],
  declarations: [ThemesPage, ThemeEditorComponent]
})
export class ThemesPageModule {}
