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

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.page.html',
  styleUrls: ['./crear-ruta.page.scss'],
})
export class CrearRutaPage implements OnInit {
  
  tipoLugares: ITipoLugar[] = [];
  lugarOrigen = [];
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
    private db: DbEleccionesService
  ) { 

    this.obtenerTransportes();
  }

  ngOnInit() {
    this.db.GetDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.regiones.subscribe( (data: IRegion[]) => {
          this.regiones = data;
          this.regionDestino = data;
          console.log("regiones:", this.regiones);
        });

        this.db.tipoLugares.subscribe( (data: ITipoLugar[]) => {
          this.tipoLugares = data;
          console.log("tipoLugares:", this.tipoLugares);
        });
      }
    });
  }
  
  ionionViewWillEnter() {
    
  }
  // origen 0 destino origen 1 destino

  cambioComuna(region: IRegion, origen: number) {
    this.comumas = [];
    console.log('cambio comuna',region.regId);          
    this.db.ObtenerProvinciasPorRegion(region).then((provincias: IProvincia[]) =>{            
      provincias.forEach(provincias => {         
        this.comunasPorProvincia(provincias).then((com: any[]) => {
            com.forEach(c => {             
              if (origen === 0) {
                this.comumas.push(c);
              } else if (origen === 1)  {
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

  crearRuta() {
    this.ruta.codigos = this.codigos;

    console.log('rutaIngresar: ', this.ruta);

    if (this.isValidRuta()) {
      this.ruta.estado = 2;
      // guardar ruta
      console.log('ruta:', this.ruta);
      this.rutaServ.insertarRutas(this.ruta);
      // redireccionar
      this.route.navigate(['/mis-rutas']);
    } else {
      this.alert.Toast('Debe ingresar todos los campos');
    }
  }

  isValidRuta(): boolean {
    var resp = false;
    if (
      this.ruta.regionOrigen != null 
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
    if (this.transporte.patente === ''){
      this.alert.Alerta("debe ingresar la patente");
    } else {
      this.db.obtenerTransportePorPatente(this.transporte.patente).then(trans => {
        console.log("trans :", trans);
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
  cambiarLugar(idTipoLugar) {
    this.db.ObtenerLugaresPorTipo(idTipoLugar).then(data => {
      if( data.length > 0 ) {
        this.lugarOrigen = data;
      }
      console.log("this.lugarOrigen ", this.lugarOrigen );
    });
  }
}



