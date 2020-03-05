import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearRutaPageRoutingModule } from './crear-ruta-routing.module';

import { CrearRutaPage } from './crear-ruta.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearRutaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CrearRutaPage]
})
export class CrearRutaPageModule {

  
}
