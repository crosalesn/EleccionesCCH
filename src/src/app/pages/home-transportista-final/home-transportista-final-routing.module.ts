import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTransportistaFinalPage } from './home-transportista-final.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTransportistaFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTransportistaFinalPageRoutingModule {}
