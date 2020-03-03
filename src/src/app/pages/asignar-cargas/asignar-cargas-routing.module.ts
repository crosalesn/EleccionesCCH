import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarCargasPage } from './asignar-cargas.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarCargasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarCargasPageRoutingModule {}
