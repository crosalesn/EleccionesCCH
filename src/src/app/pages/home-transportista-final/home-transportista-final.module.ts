import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTransportistaFinalPageRoutingModule } from './home-transportista-final-routing.module';

import { HomeTransportistaFinalPage } from './home-transportista-final.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTransportistaFinalPageRoutingModule
  ],
  declarations: [HomeTransportistaFinalPage]
})
export class HomeTransportistaFinalPageModule {}
