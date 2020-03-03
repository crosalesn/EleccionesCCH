import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisRecepcionesPage } from './mis-recepciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisRecepcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisRecepcionesPageRoutingModule {}
