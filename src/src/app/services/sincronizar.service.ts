import { Injectable } from '@angular/core';
import { EleccionesService } from './elecciones.service';
import { LoadingController } from '@ionic/angular';
import { DbEleccionesService } from './db-elecciones.service';
import { Router} from '@angular/router';
import { NetworkService } from './network.service';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class SincronizarService {

  private TableCoordenadasUsuario: any = null;
  public usuario: any;

  constructor(private loadingController: LoadingController, 
    private eleccionesService: EleccionesService, 
    private dbElecciones: DbEleccionesService,
    public alert: AlertasService,
    private router:Router, private net: NetworkService) { }

  Sincronizar() : Promise<boolean> {

    let outerThis = this;
    var promise = new Promise<boolean>(function(resolve, reject) {
      console.log("Se llama Inicio() de Sincronizar");
      outerThis.net.checkNetworkStatusNow().then(estoyConectado => {
        if(!estoyConectado){
          outerThis.alert.Alerta("Debe estar conectado a internet para sincronizar");
          resolve(false);
        }
    
        outerThis.Loading();
        var arregloDePromesas = [];
        // Sincronizacion COORDENADAS
        var syncCoords = outerThis.dbElecciones.GetCoordenadasUsuarios().then((data) => {
          var largo: number = data.LISTA_COORDENADAS.length;
          console.log(data);
          if(largo > 0){
            outerThis.eleccionesService.GuardarCoordenadasUsuario(data)
            .subscribe(
              (info) => {
                if(info.error.codigo == 0){
                  outerThis.dbElecciones.UpdateCoordenadasUsuarios();
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
        var syncInicioFin = outerThis.dbElecciones.ObtenerRegistroInicioFinDiaLocal().then(data => {
          console.log("Imprimiendo registro de tabla REGISTRO_INICIO_FIN_DIA:");
          console.log(data);
          if(data == null){
            console.log("Sin registros para sincronizar - Tabla: REGISTRO_INICIO_FIN_DIA");
          }else{
            outerThis.eleccionesService.GuardarInicioFinDiaOffline(data)
              .subscribe(data => {
                if(data.error.codigo == 0){
                  console.log("Datos guardados");
                  outerThis.dbElecciones.ActualizarRegistroInicioFinDiaLocal();
                  outerThis.TableCoordenadasUsuario = { nombre: "REGISTRO_INICIO_FIN_DIA" };
                }else{
                  outerThis.alert.Alerta("No se sincronizo la tabla REGISTRO_INICIO_FIN_DIA");
                }
              }, 
              error => {
                outerThis.alert.Alerta("Error de conexion al servidor");
                reject();
              });
          }
        });
        arregloDePromesas.push(syncInicioFin);
		
		var syncParametros = outerThis.eleccionesService.ObtenerParametros().subscribe(data => {
        console.log("Obteiendo parametros del servidor");
        if(data != null){
          outerThis.dbElecciones.GuardarParametrosLocal(data).then(data => {
            console.log("Parametros guardados");
          });
        }
      });

      arregloDePromesas.push(syncParametros);
	  
        console.log(outerThis.TableCoordenadasUsuario);
    
        Promise.all(arregloDePromesas).then(x => { 
            outerThis.loadingController.dismiss(null,null,'cerrar').then(() =>{
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
