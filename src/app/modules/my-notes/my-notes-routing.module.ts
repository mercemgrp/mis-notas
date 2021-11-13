import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistsNoteGuard } from './guards/exists-note.guard';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./pages/notes-list/notes-list.module').then(m => m.NotesListPageModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./pages/view-note/view-note.module').then(m => m.ViewNotePageModule),
    canActivate: [ExistsNoteGuard]
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/edit-note/edit-note.module').then(m => m.EditNotePageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/edit-note/edit-note.module').then(m => m.EditNotePageModule),
    canActivate: [ExistsNoteGuard]
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
