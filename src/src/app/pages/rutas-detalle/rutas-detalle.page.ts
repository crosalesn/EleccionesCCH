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
  ruta: IRuta;
  constructor(
    private route: Router,
    private rutaServ: RutaService
    ) {
    this.rutas = {
      "RUTA": [
        {
          "ORIGEN": [
            {
              "LUG_NOMBRE": "Colegio 01",
              "LUG_CALLE": "Huerfanos",
              "LUG_NUMERO": "835",
              "LUG_COMUNA": "Santiago",
              "ESTADO": "2",
            }
          ],
          "DESTINO": [
            {
              "LUG_NOMBRE": "Colegio 02",
              "LUG_CALLE": "Huerfanos",
              "LUG_NUMERO": "836",
              "LUG_COMUNA": "Santiago",
              "ESTADO": "2",
            }
          ]
        }
      ]
    }

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
