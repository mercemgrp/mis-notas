import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotestListPage } from './notes-list.page';

const routes: Routes = [
  {
    path: '',
    component: NotestListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesListPageRoutingModule {}
