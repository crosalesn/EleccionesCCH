import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rutas-detalle',
  templateUrl: './rutas-detalle.page.html',
  styleUrls: ['./rutas-detalle.page.scss'],
})
export class RutasDetallePage implements OnInit {

  private rutas: object;

  constructor() {
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

}
