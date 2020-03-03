import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgruparBolsaPageRoutingModule } from './agrupar-bolsa-routing.module';

import { AgruparBolsaPage } from './agrupar-bolsa.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgruparBolsaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AgruparBolsaPage]
})
export class AgruparBolsaPageModule {}
