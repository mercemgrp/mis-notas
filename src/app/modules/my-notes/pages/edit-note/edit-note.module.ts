import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditNotePage } from './edit-note.page';

import { EditNotePageRoutingModule } from './edit-note-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyNotesSharedModule } from '../../shared/my-notes-shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EditNotePageRoutingModule,
    SharedModule,
    MyNotesSharedModule
  ],
  declarations: [EditNotePage]
})
export class EditNotePageModule {}
