import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewNotePage } from './view-note.page';
import { ViewNotePageRoutingModule } from './view-note-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShellModule } from 'src/app/shell/shell.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewNotePageRoutingModule,
    SharedModule,
    ShellModule
  ],
  declarations: [ViewNotePage]
})
export class ViewNotePageModule {}
