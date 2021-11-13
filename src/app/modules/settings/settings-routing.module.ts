import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'colors'
  },
  {
    path: 'colors',
    loadChildren: () => import('./pages/colors/colors.module').then( m => m.ColorsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SettingsRoutingModule {}
