import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearRutaPage } from './crear-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: CrearRutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearRutaPageRoutingModule {}
