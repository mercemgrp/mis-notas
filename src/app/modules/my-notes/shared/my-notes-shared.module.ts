import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyNoteComponent } from './components/my-note/my-note.component';
import { MyNoteEditComponent } from './components/my-note-edit/my-note-edit.component';
import { NoteHeaderComponent } from './components/note-header/note-header.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [],
  declarations: [MyNoteComponent, MyNoteEditComponent, NoteHeaderComponent, ColorSelectorComponent],
  exports: [MyNoteComponent, MyNoteEditComponent, NoteHeaderComponent, ColorSelectorComponent]
})
export class MyNotesSharedModule {}
