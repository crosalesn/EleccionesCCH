import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutasEscanearPage } from './rutas-escanear.page';

const routes: Routes = [
  {
    path: '',
    component: RutasEscanearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutasEscanearPageRoutingModule {}
