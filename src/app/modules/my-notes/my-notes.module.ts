import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyNotesPageRoutingModule } from './my-notes-routing.module';

import { ExistsNoteGuard } from './guards/exists-note.guard';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyNotesPageRoutingModule,
  ],
  providers: [ExistsNoteGuard],
  declarations: []
})
export class MyNotesModule {}
