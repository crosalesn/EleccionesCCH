import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarPageRoutingModule } from './sincronizar-routing.module';

import { SincronizarPage } from './sincronizar.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SincronizarPage]
})
export class SincronizarPageModule {}
