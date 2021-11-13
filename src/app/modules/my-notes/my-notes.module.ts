import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyNotesPageRoutingModule } from './my-notes-routing.module';

import { MyNotesPage } from './my-notes.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShellModule } from 'src/app/shell/shell.module';
import { ExistsNoteGuard } from './guards/exists-note.guard';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyNotesPageRoutingModule,
    SharedModule,
    ShellModule
  ],
  providers: [ExistsNoteGuard],
  declarations: [MyNotesPage]
})
export class MyNotesModule {}
