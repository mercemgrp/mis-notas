import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditNotePage } from './edit-note.page';

const routes: Routes = [
  {
    path: '',
    component: EditNotePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditNotePageRoutingModule {}
