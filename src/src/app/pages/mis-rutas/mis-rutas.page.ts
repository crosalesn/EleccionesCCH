import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-rutas',
  templateUrl: './mis-rutas.page.html',
  styleUrls: ['./mis-rutas.page.scss'],
})
export class MisRutasPage implements OnInit {

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
        },
        {
          "ORIGEN": [
            {
              "LUG_NOMBRE": "Colegio 05",
              "LUG_CALLE": "Gran Avenida",
              "LUG_NUMERO": "123",
              "LUG_COMUNA": "San Miguel",
              "ESTADO": "1",
            }
          ],
          "DESTINO": [
            {
              "LUG_NOMBRE": "Colegio 09",
              "LUG_CALLE": "Huerfanos",
              "LUG_NUMERO": "222",
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
