import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorsPageRoutingModule } from './colors-routing.module';

import { ColorsPage } from './colors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ColorsPageRoutingModule
  ],
  declarations: [ColorsPage]
})
export class ColorsPageModule {}
