import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutasDetallePageRoutingModule } from './rutas-detalle-routing.module';

import { RutasDetallePage } from './rutas-detalle.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutasDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [RutasDetallePage]
})
export class RutasDetallePageModule {}
