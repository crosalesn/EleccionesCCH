import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rutas-detalle',
  templateUrl: './rutas-detalle.page.html',
  styleUrls: ['./rutas-detalle.page.scss'],
})
export class RutasDetallePage implements OnInit {

  private rutas: object;

  constructor(private route: Router) {
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
