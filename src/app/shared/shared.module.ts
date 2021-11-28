import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FullScreenImageComponent } from './components/full-screen-image/full-screen-image.component';
import { ImagesListComponent } from './components/images-list/images-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ModalComponent } from './components/modal/modal.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';


@NgModule({
  declarations: [
    FullScreenImageComponent,
    ImagesListComponent,
    CalendarComponent,
    DatePickerComponent,
    FormatDatePipe,
    ModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FullScreenImageComponent,
    CalendarComponent,
    DatePickerComponent,
    ImagesListComponent,
    FormatDatePipe,
    ModalComponent
  ]
})
export class SharedModule { }
