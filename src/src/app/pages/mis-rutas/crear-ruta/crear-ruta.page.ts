import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.page.html',
  styleUrls: ['./crear-ruta.page.scss'],
})
export class CrearRutaPage implements OnInit {
  rutas = {
    "RUTA": [
      {
        "ORIGEN": [
          {
            "LUG_CODIGO": "CODORI001",
            "LUG_NOMBRE": "Colegio 01",
            "LUG_CALLE": "Huerfanos",
            "LUG_NUMERO": "835",
            "LUG_COMUNA": "Santiago",
            "ESTADO": "2",
          }
        ],
        "DESTINO": [
          {
            "LUG_CODIGO": "CODDES001",
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
            "LUG_CODIGO": "CODORI002",
            "LUG_NOMBRE": "Colegio 05",
            "LUG_CALLE": "Gran Avenida",
            "LUG_NUMERO": "123",
            "LUG_COMUNA": "San Miguel",
            "ESTADO": "1",
          }
        ],
        "DESTINO": [
          {
            
            "LUG_CODIGO": "CODDES002",
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
  constructor() { }
  
  ngOnInit() {
  }

}
