import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignarCargasPageRoutingModule } from './asignar-cargas-routing.module';

import { AsignarCargasPage } from './asignar-cargas.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarCargasPageRoutingModule,
    ComponentsModule
  ],
  exports:[
    AsignarCargasPage
  ],
  declarations: [AsignarCargasPage]
})
export class AsignarCargasPageModule {}
