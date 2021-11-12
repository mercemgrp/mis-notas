import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyNoteComponent } from './components/my-note/my-note.component';
import { MyNoteEditComponent } from './components/my-note-edit/my-note-edit.component';
import { OptionsSelectorComponent } from './components/options-selector/options-selector.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FullScreenImageComponent } from './components/full-screen-image/full-screen-image.component';
import { ImagesListComponent } from './components/images-list/images-list.component';
import { NoteHeaderComponent } from './components/note-header/note-header.component';


@NgModule({
  declarations: [
    NoteHeaderComponent,
    MyNoteComponent,
    MyNoteEditComponent,
    OptionsSelectorComponent,
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
    NoteHeaderComponent,
    MyNoteComponent,
    MyNoteEditComponent,
    FullScreenImageComponent,
    OptionsSelectorComponent,
    ImagesListComponent
  ]
})
export class SharedModule { }
