import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditNotePage } from './edit-note.page';

import { EditNotePageRoutingModule } from './edit-note-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyNotesSharedModule } from '../../shared/my-notes-shared.module';
import { EditTextAreaComponent } from './edit-text-area/edit-text-area.component';
import { EditListComponent } from './edit-list/edit-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditNotePageRoutingModule,
    SharedModule,
    MyNotesSharedModule
  ],
  declarations: [EditNotePage, EditTextAreaComponent, EditListComponent]
})
export class EditNotePageModule {}
