import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyNoteComponent } from './components/my-note/my-note.component';
import { NoteHeaderComponent } from './components/note-header/note-header.component';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [],
  declarations: [MyNoteComponent, NoteHeaderComponent, ThemeSelectorComponent],
  exports: [MyNoteComponent, NoteHeaderComponent, ThemeSelectorComponent]
})
export class MyNotesSharedModule {}
