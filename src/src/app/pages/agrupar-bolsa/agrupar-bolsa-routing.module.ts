import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgruparBolsaPage } from './agrupar-bolsa.page';

const routes: Routes = [
  {
    path: '',
    component: AgruparBolsaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgruparBolsaPageRoutingModule {}
