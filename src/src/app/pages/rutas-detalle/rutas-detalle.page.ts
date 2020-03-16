import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutaService } from 'src/app/services/ruta.service';
import { IRuta } from 'src/app/interfaces/ruta.interface';

@Component({
  selector: 'app-rutas-detalle',
  templateUrl: './rutas-detalle.page.html',
  styleUrls: ['./rutas-detalle.page.scss'],
})
export class RutasDetallePage implements OnInit {

  private rutas: object;
  ruta: any;
  constructor(
    private route: Router,
    private rutaServ: RutaService
    ) {
  }

  ngOnInit() {    
  }

  ionViewWillEnter() {
    this.ruta = this.rutaServ.getRuta();
  }
  // 0 origen 1 destino
  escanearRuta(tipo: number) {
    if (tipo === 0) {
      console.log("origen");
      this.route.navigate(['/escanear-bolsa']);
    } else if (tipo === 1) {
      // escanear destino
      console.log("destino");
      this.route.navigate(['/escanear-bolsa']);
    }

  }
}
