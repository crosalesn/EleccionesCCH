import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTransportistaInicialPage } from './home-transportista-inicial.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTransportistaInicialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTransportistaInicialPageRoutingModule {}
