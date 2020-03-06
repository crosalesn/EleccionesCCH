import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// mis-rutas
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home-transportista-final',
    loadChildren: () => import('./pages/home-transportista-final/home-transportista-final.module').then( m => m.HomeTransportistaFinalPageModule)
  },
  {
    path: 'home-transportista-inicial',
    loadChildren: () => import('./pages/home-transportista-inicial/home-transportista-inicial.module').then( m => m.HomeTransportistaInicialPageModule)
  },
  {
    path: 'escanear-bolsa',
    loadChildren: () => import('./pages/escanear-bolsa/escanear-bolsa.module').then( m => m.EscanearBolsaPageModule)
  },
  {
    path: 'asignar-cargas',
    loadChildren: () => import('./pages/asignar-cargas/asignar-cargas.module').then( m => m.AsignarCargasPageModule)
  },
  {
    path: 'agrupar-bolsa',
    loadChildren: () => import('./pages/agrupar-bolsa/agrupar-bolsa.module').then( m => m.AgruparBolsaPageModule)
  },
  {
    path: 'mis-recepciones',
    loadChildren: () => import('./pages/mis-recepciones/mis-recepciones.module').then( m => m.MisRecepcionesPageModule)
  },
  {
    path: 'mis-rutas',
    loadChildren: () => import('./pages/mis-rutas/mis-rutas.module').then( m => m.MisRutasPageModule)
  },
  {
    path: 'rutas-detalle',
    loadChildren: () => import('./pages/rutas-detalle/rutas-detalle.module').then( m => m.RutasDetallePageModule)
  },
  {
    path: 'sincronizar',
    loadChildren: () => import('./pages/sincronizar/sincronizar.module').then( m => m.SincronizarPageModule)
  },  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
