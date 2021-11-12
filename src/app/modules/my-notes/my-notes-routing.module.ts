import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./notes-list/notes-list.module').then(m => m.NotesListPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view-note/view-note.module').then(m => m.ViewNotePageModule),
  },
  {
    path: 'create',
    loadChildren: () => import('./edit-note/edit-note.module').then(m => m.EditNotePageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-note/edit-note.module').then(m => m.EditNotePageModule)
  },
  {
    path: '',
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MyNotesPageRoutingModule {}
