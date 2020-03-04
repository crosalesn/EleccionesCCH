import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { EleccionesService } from '../../services/elecciones.service';
import { DbEleccionesService } from '../../services/db-elecciones.service';
import { Router} from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkService } from '../../services/network.service';
import { AlertasService } from '../../services/alertas.service'

@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.page.html',
  styleUrls: ['./sincronizar.page.scss'],
})
export class SincronizarPage implements OnInit {

  private TableCoordenadasUsuario: any = null;
  private estoyConectado : boolean;
  public usuario: any;

  constructor(private loadingController: LoadingController, 
    private eleccionesService: EleccionesService, 
    private dbElecciones: DbEleccionesService,
    private net: NetworkService, private alerta: AlertasService,
    private router:Router, private funciones: FuncionesService) {
      console.log("Se llama constructor de sincronizar");
      debugger
      this.usuario = funciones.GetUsuarioLogeado();
      //this.Inicio();
    }

  ngOnInit() {
    console.log("Se llama onInit de Sincronizar")
  }

  Sincronizar() : Promise<boolean> {

    var promise = new Promise<boolean>(function(resolve, reject) {
      console.log("Se llama Inicio() de Sincronizar");
      this.net.checkNetworkStatusNow().then(estoyConectado => {
        if(!estoyConectado){
          this.alerta.Toast("Debe conectarse a internet para poder Sincronizar");
          resolve(false);
        }
    
        this.Loading();
        var arregloDePromesas = [];
        // Sincronizacion COORDENADAS
        var syncCoords = this.dbElecciones.GetCoordenadasUsuarios().then((data)=>{
          var largo: number = Array(data).length;
      
            console.log(data);
            if(largo > 0){
              this.eleccionesService.GuardarCoordenadasUsuario(data)
              .subscribe(
                (info) => {
                  if(info.error.codigo == 0){
                    this.dbElecciones.UpdateCoordenadasUsuarios();
                    //this.TableCoordenadasUsuario = { nombre: "COORDENADAS_USUARIOS" };
                    console.log("Sincronizando: "+info.error.mensaje);
                    
                  }else{
                    console.log("Las coordenadas no se sincronizaron");
                  }
                  
                },error =>{
                  console.log("Error de GuardarCoordenadasUsuario :");
                  console.error(error);
                  reject();
                });
            }else{
              console.log("Sin registros para sincronizar - Tabla: COORDENADAS_USUARIOS")
            }
        }, error =>{
          console.error("Error en el GetCoordenadasUsuarios:"+ error);
          reject();
        });
        arregloDePromesas.push(syncCoords);
    
        //SINCRONIZACION REGISTRO INICIO / FIN DIA
        var syncInicioFin = this.dbElecciones.ObtenerRegistroInicioFinDiaLocal().then(data => {
          console.log("Imprimiendo registro de tabla REGISTRO_INICIO_FIN_DIA:");
          console.log(data);
          if(data == null){
            console.log("Sin registros para sincronizar - Tabla: REGISTRO_INICIO_FIN_DIA");
          }else{
            this.eleccionesService.GuardarInicioFinDiaOffline(data)
              .subscribe(data => {
                if(data.error.codigo == 0){
                  console.log("Datos guardados");
                  this.dbElecciones.ActualizarRegistroInicioFinDiaLocal();
                  this.TableCoordenadasUsuario = { nombre: "REGISTRO_INICIO_FIN_DIA" };
                }else{
                  this.alerta.Toast("No se sincronizo la tabla REGISTRO_INICIO_FIN_DIA");
                }
              }, 
              error => {
                this.alerta.Toast("Error de conexion al servidor");
                reject();
              });
          }
        });
        arregloDePromesas.push(syncInicioFin);
        console.log(this.TableCoordenadasUsuario);
    
        Promise.all(arregloDePromesas).then(x => { 
            this.loadingController.dismiss(null,null,'cerrar').then(() =>{
            console.log("Cerrando el Spinner");
            resolve(true);
          });
        });
      })
    });
    return promise;
  }

  async Loading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 15000,
      message: 'Sincronizando...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
      id:'cerrar'
    });
    await loading.present();
  }

}
