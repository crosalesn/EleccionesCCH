import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisRecepcionesPageRoutingModule } from './mis-recepciones-routing.module';

import { MisRecepcionesPage } from './mis-recepciones.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisRecepcionesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MisRecepcionesPage]
})
export class MisRecepcionesPageModule {}
