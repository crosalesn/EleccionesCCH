import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisRutasPage } from './mis-rutas.page';

const routes: Routes = [
  {
    path: '',
    component: MisRutasPage
  },  {
    path: 'crear-ruta',
    loadChildren: () => import('./crear-ruta/crear-ruta.module').then( m => m.CrearRutaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisRutasPageRoutingModule {}
