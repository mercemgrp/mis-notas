import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'colors'
  },
  {
    path: 'colors',
    loadChildren: () => import('./pages/themes/themes.module').then( m => m.ThemesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SettingsRoutingModule {}
