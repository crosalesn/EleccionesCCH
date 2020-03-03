import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutasEscanearPageRoutingModule } from './rutas-escanear-routing.module';

import { RutasEscanearPage } from './rutas-escanear.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  entryComponents: [RutasEscanearPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutasEscanearPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RutasEscanearPage]
})
export class RutasEscanearPageModule {}
