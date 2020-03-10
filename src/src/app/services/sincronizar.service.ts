import { Injectable } from '@angular/core';
import { EleccionesService } from './elecciones.service';
import { LoadingController } from '@ionic/angular';
import { DbEleccionesService } from './db-elecciones.service';
import { Router } from '@angular/router';
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
    private router: Router, private net: NetworkService) { }

  Sincronizar(): Promise<boolean> {

    let outerThis = this;
    var promise = new Promise<boolean>(function (resolve, reject) {
      console.log("Se llama Inicio() de Sincronizar");
      outerThis.net.checkNetworkStatusNow().then(estoyConectado => {
        if (!estoyConectado) {
          outerThis.alert.Alerta("Debe estar conectado a internet para sincronizar");
          resolve(false);
        }

        outerThis.Loading();
        var arregloDePromesas = [];
        // Sincronizacion COORDENADAS
        var syncCoords = outerThis.dbElecciones.GetCoordenadasUsuarios().then((data) => {
          var largo: number = data.LISTA_COORDENADAS.length;
          console.log(data);
          if (largo > 0) {
            outerThis.eleccionesService.GuardarCoordenadasUsuario(data)
              .subscribe(
                (info) => {
                  if (info.error.codigo == 0) {
                    outerThis.dbElecciones.UpdateCoordenadasUsuarios();
                    console.log("Sincronizando: " + info.error.mensaje);
                  } else {
                    console.log("Las coordenadas no se sincronizaron");
                  }
                }, error => {
                  console.log("Error de GuardarCoordenadasUsuario :");
                  console.error(error);
                  reject();
                });
          } else {
            console.log("Sin registros para sincronizar - Tabla: COORDENADAS_USUARIOS")
          }
        }, error => {
          console.error("Error en el GetCoordenadasUsuarios:" + error);
          reject();
        });
        arregloDePromesas.push(syncCoords);

        //SINCRONIZACION REGISTRO INICIO / FIN DIA
        var syncInicioFin = outerThis.dbElecciones.ObtenerRegistroInicioFinDiaLocal().then(data => {
          console.log("Imprimiendo registro de tabla REGISTRO_INICIO_FIN_DIA:");
          console.log(data);
          if (data == null) {
            console.log("Sin registros para sincronizar - Tabla: REGISTRO_INICIO_FIN_DIA");
          } else {
            outerThis.eleccionesService.GuardarInicioFinDiaOffline(data)
              .subscribe(data => {
                if (data.error.codigo == 0) {
                  console.log("Datos guardados");
                  outerThis.dbElecciones.ActualizarRegistroInicioFinDiaLocal();
                  outerThis.TableCoordenadasUsuario = { nombre: "REGISTRO_INICIO_FIN_DIA" };
                } else {
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

        let promesaParametros = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerParametros().subscribe(data => {
            console.log("Obteiendo parametros del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarParametrosLocal(data).then(data => {
                resolve();
                console.log("Parametros guardados");
              }, error => {
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener parámetros");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaParametros);

        let promesaRegiones = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerRegiones().subscribe(data => {
            console.log("Obteiendo regiones del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarRegionesLocal(data).then(data => {
                resolve();
                console.log("Regiones guardadas");
              }, error => {
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener regiones");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaRegiones);

        let promesaProvincias = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerProvincias().subscribe(data => {
            console.log("Obteiendo provincias del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarProvinciasLocal(data).then(data => {
                resolve();
                console.log("Provincias guardadas");
              }, error => {
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener provincias");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaProvincias);

        let promesaComunas = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerComunas().subscribe(data => {
            console.log("Obteniendo comunas del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarComunasLocal(data).then(data => {
                resolve();
                console.log("Comunas guardadas");
              }, error => {
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener comunas");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaComunas);

        let promesaTipoLugares = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerTipoLugares().subscribe(data => {
            console.log("Obteniendo Tipo Lugares del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarTipoLugaresLocal(data).then(data => {
                resolve();
                console.log("Tipo Lugares guardadas");
              }, error => {
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener tipo lugares");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaComunas);
        
        let promesaLugares = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerLugares().subscribe(data => {
            console.log("Obteniendo Lugares del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarLugaresLocal(data).then(data => {
                resolve();
                console.log("Lugares guardadas");
              }, error => {
                console.log("Ocurrió un error al guardar los lugares localmente");
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener lugares");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaLugares);

        let promesaEmpresasTransporte = new Promise((resolve, reject) => {
          var usr_string = localStorage.getItem("usuarioActual");
          var usuario = JSON.parse(usr_string).usuario;
          outerThis.eleccionesService.ObtenerEmpresasTransporte({"USU_ID": parseInt(usuario.USU_ID)}).subscribe(data => {
            console.log("Obteniendo EmpresasTransporte del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarEmpresasTransporteLocal(data).then(data => {
                resolve();
                console.log("EmpresasTransporte guardadas");
              }, error => {
                console.log("Ocurrió un error al guardar los EmpresasTransporte localmente");
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener EmpresasTransporte");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaEmpresasTransporte);

        let promesaTransportes = new Promise((resolve, reject) => {
          var usr_string = localStorage.getItem("usuarioActual");
          var usuario = JSON.parse(usr_string).usuario;
          let parametros = {
            USU_ID: usuario.USU_ID,
            ETR_ID: usuario.ETR_ID
          }
          outerThis.eleccionesService.ObtenerTransportes(parametros).subscribe(data => {
            console.log("Obteniendo Transportes del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarTransportesLocal(data).then(data => {
                resolve();
                console.log("Transportes guardadas");
              }, error => {
                console.log("Ocurrió un error al guardar los Transportes localmente");
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener Transportes");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaTransportes);

        console.log(outerThis.TableCoordenadasUsuario);

        Promise.all(arregloDePromesas).then(x => {
          outerThis.loadingController.dismiss(null, null, 'cerrar').then(() => {
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
      id: 'cerrar'
    });
    await loading.present();
  }
}
