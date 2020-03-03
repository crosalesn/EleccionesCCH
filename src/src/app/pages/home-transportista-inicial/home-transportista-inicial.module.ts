import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTransportistaInicialPageRoutingModule } from './home-transportista-inicial-routing.module';

import { HomeTransportistaInicialPage } from './home-transportista-inicial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTransportistaInicialPageRoutingModule
  ],
  declarations: [HomeTransportistaInicialPage]
})
export class HomeTransportistaInicialPageModule {}
