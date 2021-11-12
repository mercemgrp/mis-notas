import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotestListPage } from './notes-list.page';

import { NotesListPageRoutingModule } from './notes-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShellModule } from 'src/app/shell/shell.module';
import { NotesListHeaderComponent } from './notes-list-header/notes-list-header.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NotesListPageRoutingModule,
    SharedModule,
    ShellModule
  ],
  declarations: [NotestListPage, NotesListHeaderComponent]
})
export class NotesListPageModule {}
