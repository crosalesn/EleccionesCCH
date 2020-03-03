import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutasDetallePage } from './rutas-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: RutasDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutasDetallePageRoutingModule {}
