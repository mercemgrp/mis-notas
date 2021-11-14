import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewNotePage } from './view-note.page';
import { ViewNotePageRoutingModule } from './view-note-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyNotesSharedModule } from '../../shared/my-notes-shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewNotePageRoutingModule,
    SharedModule,
    MyNotesSharedModule
  ],
  declarations: [ViewNotePage]
})
export class ViewNotePageModule {}
