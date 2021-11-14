import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FullScreenImageComponent } from './components/full-screen-image/full-screen-image.component';
import { ImagesListComponent } from './components/images-list/images-list.component';


@NgModule({
  declarations: [
    FullScreenImageComponent,
    ImagesListComponent,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FullScreenImageComponent,
    ImagesListComponent,
    FormatDatePipe
  ]
})
export class SharedModule { }
