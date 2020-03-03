import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscanearBolsaPage } from './escanear-bolsa.page';

const routes: Routes = [
  {
    path: '',
    component: EscanearBolsaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscanearBolsaPageRoutingModule {}
