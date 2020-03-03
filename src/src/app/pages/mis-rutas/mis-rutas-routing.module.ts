import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisRutasPage } from './mis-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: MisRutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisRutasPageRoutingModule {}
