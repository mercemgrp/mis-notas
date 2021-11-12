import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'my-notes',
    loadChildren: () => import('./modules/my-notes/my-notes.module').then(m => m.MyNotesPageModule)
  },
  {
    path: '',
    redirectTo: 'my-notes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'my-notes',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
