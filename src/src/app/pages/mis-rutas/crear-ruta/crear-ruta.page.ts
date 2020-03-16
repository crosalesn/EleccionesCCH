import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AsignarCargasPage } from '../../asignar-cargas/asignar-cargas.page';
import { AlertasService } from 'src/app/services/alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RutaService } from 'src/app/services/ruta.service';
import { IRuta } from 'src/app/interfaces/ruta.interface';
import { DbEleccionesService } from 'src/app/services/db-elecciones.service';
import { IRegion } from 'src/app/interfaces/region.interface';
import { ITipoLugar } from 'src/app/interfaces/tipo_lugar.interface';
import { IProvincia } from 'src/app/interfaces/provincia.interface';
import { v4 as uuidv4 } from 'uuid';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.page.html',
  styleUrls: ['./crear-ruta.page.scss'],
})
export class CrearRutaPage implements OnInit {

  tipoLugares: ITipoLugar[] = [];

  lugaresOrigen = [];
  lugaresDestino = [];

  transporte = {
    patente: '',
    id: null
  };

  regiones: IRegion[] = [];
  provincias = [];
  comumas = [];

  regionesDestino: IRegion[] = [];
  provinciasDestino = [];
  comumasDestino = [];

  ruta: IRuta = {
    id: uuidv4(),
    regionOrigen: null,
    comumaOrigen: {},
    regionDestino: null,
    comumaDestino: {},
    codigos: [],
    estado: 2,
    tipoLugarDestino: null,
    tipoLugarOrigen: null,
    lugarDestino: null,
    lugarOrigen: null,
  };

  codigos: string[] = [];

  rutas = {
    RUTA: [
      {
        ORIGEN: [
          {
            LUG_CODIGO: 'CODORI001',
            LUG_NOMBRE: 'Colegio 01',
            LUG_CALLE: 'Huerfanos',
            LUG_NUMERO: '835',
            LUG_COMUNA: 'Santiago',
            ESTADO: '2',
          }
        ],
        DESTINO: [
          {
            LUG_CODIGO: 'CODDES001',
            LUG_NOMBRE: 'Colegio 02',
            LUG_CALLE: 'Huerfanos',
            LUG_NUMERO: '836',
            LUG_COMUNA: 'Santiago',
            ESTADO: '2',
          }
        ]
      },
      {
        ORIGEN: [
          {
            LUG_CODIGO: 'CODORI002',
            LUG_NOMBRE: 'Colegio 05',
            LUG_CALLE: 'Gran Avenida',
            LUG_NUMERO: '123',
            LUG_COMUNA: 'San Miguel',
            ESTADO: '1',
          }
        ],
        DESTINO: [
          {

            LUG_CODIGO: 'CODDES002',
            LUG_NOMBRE: 'Colegio 09',
            LUG_CALLE: 'Huerfanos',
            LUG_NUMERO: '222',
            LUG_COMUNA: 'Santiago',
            ESTADO: '2',
          }
        ]
      }
    ]
  };
  regionDestino: any;
  comumaDestino: any;
  estado: any;
  tipoLugarDestino: any;
  tipoLugarOrigen: any;

  constructor(
    private route: Router,
    private modalController: ModalController,
    private alert: AlertasService,
    private user: UsuarioService,
    private rutaServ: RutaService,
    private db: DbEleccionesService,
    private geolocation: Geolocation
  ) {
    console.log('usuarioLogeado:', user);
    this.obtenerTransportes();
  }

  ngOnInit() {
    this.db.GetDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.getAllLugares().then(lug => {
          console.log('todosLos Lugares ', lug);
        });

        this.db.ObtenerRegiones().then(data => {
          console.log('regiones: ', data);
          this.regiones = data;
          this.regionDestino = data;
        });
        this.db.ObtenerTipoLugares().then((data: ITipoLugar[]) => {
          this.tipoLugares = data;
          console.log('tipoLugares:', this.tipoLugares);
        });
      }
    });
  }

  ionionViewWillEnter() {

  }
  // origen 0 destino origen 1 destino

  cambioComuna(region: IRegion, origen: number) {
    this.comumas = [];
    console.log('cambio comuna', region.regId);
    this.db.ObtenerProvinciasPorRegion(region).then((provincias: IProvincia[]) => {
      // tslint:disable-next-line: no-shadowed-variable
      provincias.forEach(provincias => {
        this.comunasPorProvincia(provincias).then((com: any[]) => {
          com.forEach(c => {
            if (origen === 0) {
              this.comumas.push(c);
            } else if (origen === 1) {
              this.comumasDestino.push(c);
            }
          });
        });
      });
    });
  }

  comunasPorProvincia(idProv: IProvincia) {
    return this.db.ObtenerComunasPorProvincias(idProv.proId);
  }

  async asignarCarga() {

    const modal = await this.modalController.create({
      component: AsignarCargasPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log('dataReturned: ', dataReturned);
      if (dataReturned.data !== undefined) {
        if (dataReturned.data.length > 0) {
          dataReturned.data.forEach((element: string) => {
            this.codigos.push(element);

          });
        }
      }

    });

    return await modal.present();
  }


  isValidRuta(): boolean {
    let resp = false;
    if (
      this.ruta.regionOrigen != null
      && this.transporte != null
      && this.ruta.regionDestino != null
      && this.ruta.regionDestino != null
      && this.ruta.comumaDestino != null
      && this.ruta.codigos.length > 0
      && this.ruta.tipoLugarDestino != null
      && this.ruta.tipoLugarOrigen != null
    ) {
      resp = true;
    }
    return resp;
  }

  buscarPatente() {
    if (this.transporte.patente === '') {
      this.alert.Alerta('debe ingresar la patente');
    } else {
      console.log('PATENTE UPPER: ', this.transporte.patente.toUpperCase());
      this.db.obtenerTransportePorPatente(this.transporte.patente.toUpperCase()).then(trans => {
        console.log('trans :', trans);
        this.transporte = {
          id: trans[0].TRA_ID,
          patente: trans[0].TRA_PATENTE
        };
      });
    }
  }

  obtenerTransportes() {
    console.log('transportes: ', this.db.obtenerTransportes());
  }

  // origen 0 destino origen 1 destino
  cambioLugar(origen) {
    if (origen === 0) {
      if (this.ruta.comumaOrigen != null) {
        console.log('comunaIdOrigen ', this.ruta.comumaOrigen['COM_ID']);
        // tslint:disable-next-line: no-string-literal
        this.db.ObtenerLugarByComuna(this.ruta.comumaOrigen['COM_ID']).then(data => {
          console.log('0 cambio lugar lugares: ', data);
          this.lugaresOrigen = data;
        });
      }
    } else if (origen === 1) {
      if (this.ruta.comumaDestino != null) {
        console.log('comunaIdDestino ', this.ruta.comumaDestino['COM_ID']);
        // tslint:disable-next-line: no-string-literal
        this.db.ObtenerLugarByComuna(this.ruta.comumaDestino['COM_ID']).then(data => {
          console.log('1 cambio lugar lugares: ', data);
          this.lugaresDestino = data;
        });
      }
    }
  }

  async crearRuta() {
    // tslint:disable-next-line: no-var-keyword
    var rutaInsertar = {
      RTA_FECHA_RE: null, // OK no va
      ERU_ID: 2, // ok
      TRA_ID: null, // ok
      USU_ID: null, // ok
      LUG_ID_ORIGEN: null, // ok
      LUG_ID_DESTINO: null, // ok
      RTA_LATITUD: null, // ok
      RTA_LONGITUD: null, // ok
      // tslint:disable-next-line: max-line-length
      RTA_FECHA_DISPOSITIVO: `${ new Date().getFullYear()}-${new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()}-${new Date().getDay()}` , // ok
      RTA_SYNC: 0 // ok
    };

    this.ruta.codigos = this.codigos;

    if (this.isValidRuta()) {
      rutaInsertar.TRA_ID = this.transporte.id;
      rutaInsertar.USU_ID = this.user.usuarioLogeado.usuario.USU_ID;
      // tslint:disable-next-line: no-string-literal
      rutaInsertar.LUG_ID_ORIGEN = this.ruta.lugarOrigen.LUG_ID;
      // tslint:disable-next-line: no-string-literal
      rutaInsertar.LUG_ID_DESTINO = this.ruta.lugarDestino.LUG_ID;

      await this.obtenerCoordenadas().then(coor => {
        console.log('coordenadas ', coor);
        rutaInsertar.RTA_LATITUD = coor.latitude;
        rutaInsertar.RTA_LONGITUD = coor.longitude;
      }).catch( erro => {
        this.alert.Alerta('Error al obtener las corrdenadas');
        return;
      });

      // guardar ruta
      // console.log('rutaAInsertar:', rutaInsertar);

      await this.db.insertarRuta(rutaInsertar).then( async idInsertado => {
        console.log('idInsertadoRuta: ', idInsertado);
        this.codigos.forEach( async (cod: any) => {
          // tslint:disable-next-line: prefer-const tslint:disable-next-line: no-var-keyword
          var rutaCarga = {
            CAR_ID: cod.CAR_ID,
            RTA_ID: idInsertado,
            CAR_RTA_ESTADO: 2
          };
          await this.db.insertarRutaCarga(rutaCarga).then(idRutaCargaInsertado => {
            console.log('idRutaCargaInsertado: ', idRutaCargaInsertado);
          });
        });

        // tslint:disable-next-line: prefer-const
        let bitacoraRuta: any = {
          // tslint:disable-next-line: max-line-length
          BRU_FECHA_REGISTRO_DISPOSITIVO: `${ new Date().getFullYear()}-${new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()}-${new Date().getDay()}`,
          BRU_USUARIO_REGISTRO: this.user.usuarioLogeado.usuario.USU_ID,
          BRU_LATITUD : rutaInsertar.RTA_LATITUD,
          BRU_LONGITUD : rutaInsertar.RTA_LONGITUD,
          ERU_ID : 2,
          BRU_DESCRIPCION : 'Desde dispositivo movil',
          RTA_ID: idInsertado
        };

        await this.db.insertarBitacoraRuta(bitacoraRuta).then(idBitacoraRegistro => {
          console.log('idBitacoraRegistroInsertado: ', idBitacoraRegistro);

          this.codigos.forEach( async (cod: any) => {
            // tslint:disable-next-line: prefer-const tslint:disable-next-line: no-var-keyword
            var bitacoraRutaCarga = {
              CAR_ID: cod.CAR_ID,
              BRU_ID: idBitacoraRegistro,
            };
            await this.db.insertarBitacoraRutaCarga(bitacoraRutaCarga).then(id => {
              console.log('bitacoraRutaCargaBD: ', id);
            });
          });
        });

        this.db.obtenerRutas().then(rutas => {
          console.log('todas las Rutas: ', rutas);
        });

        this.db.obtenerRutasCargas().then(rutasCargas => {
          console.log('todas las RutasCargas: ', rutasCargas);
        });

        this.db.obtenerBitacoraRutas().then(bitacorasRutas => {
          console.log('todas las bitacorasRutas: ', bitacorasRutas);
        });

        this.db.obtenerBitacorasRutasCargas().then(bitacorasRutasCargas => {
          console.log('todas las bitacorasRutasCargas: ', bitacorasRutasCargas);
        });
      });
      // insertar rutas cargas



      // this.rutaServ.insertarRutas(this.ruta);
      // redireccionar
      // this.route.navigate(['/mis-rutas']);
    } else {
      this.alert.Toast('Debe ingresar todos los campos');
    }
  }

  async obtenerCoordenadas() {
    const coordenadas = { latitude: 0.0 , longitude: 0.0};
    await this.geolocation.getCurrentPosition().then((resp) => {
      coordenadas.latitude = resp.coords.latitude;
      coordenadas.longitude = resp.coords.longitude;
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    return coordenadas;
  }
}



