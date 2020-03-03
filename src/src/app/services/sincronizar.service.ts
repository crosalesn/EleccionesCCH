import { Injectable } from '@angular/core';
import { EleccionesService } from './elecciones.service';
import { LoadingController } from '@ionic/angular';
import { DbEleccionesService } from './db-elecciones.service';
import { AlertController } from '@ionic/angular';
import { Router} from '@angular/router';
import { FuncionesService } from './funciones.service';

@Injectable({
  providedIn: 'root'
})
export class SincronizarService {

  private TableCoordenadasUsuario: any = null;
  private estoyConectado : boolean;
  public usuario: any;


  constructor(private loadingController: LoadingController, 
    private eleccionesService: EleccionesService, 
    private dbElecciones: DbEleccionesService,
    public alert: AlertController,
    private router:Router, private funciones: FuncionesService) { }

  Sincronizar() {
    console.log("Se llama Inicio() de Sincronizar");
    this.funciones.checkNetworkStatusNow().then(estoyConectado => {
      if(!estoyConectado){
        this.funciones.msn("Debe conectarse a internet para poder Sincronizar");
        //this.router.navigateByUrl('/home');
        return;
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
              });
          }else{
            console.log("Sin registros para sincronizar - Tabla: COORDENADAS_USUARIOS")
          }
      }, error =>{
        console.error("Error en el GetCoordenadasUsuarios:"+ error);
        ;
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
                this.funciones.msn("No se sincronizo la tabla REGISTRO_INICIO_FIN_DIA");
              }
            }, 
            error => {
              this.funciones.msn("Error de conexion al servidor");
            });
        }
      });
      arregloDePromesas.push(syncInicioFin);
      console.log(this.TableCoordenadasUsuario);
  
      Promise.all(arregloDePromesas).then(x => { 
          this.loadingController.dismiss(null,null,'cerrar').then(() =>{
          console.log("Cerrando el Spinner");
          //this.router.navigateByUrl('/home');
        });
      });
    })
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
