import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EscanearBolsaPageRoutingModule } from './escanear-bolsa-routing.module';
import { EscanearBolsaPage } from './escanear-bolsa.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanearBolsaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EscanearBolsaPage]
})
export class EscanearBolsaPageModule {}
