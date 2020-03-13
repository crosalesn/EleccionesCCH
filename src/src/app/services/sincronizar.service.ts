import { Injectable } from '@angular/core';
import { EleccionesService } from './elecciones.service';
import { LoadingController } from '@ionic/angular';
import { DbEleccionesService } from './db-elecciones.service';
import { Router } from '@angular/router';
import { NetworkService } from './network.service';
import { AlertasService } from './alertas.service';
// import { DbSincroService } from './db-sincro.service';

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
    private router: Router, private net: NetworkService,
    // private dbSincro: DbSincroService
    
  ) { }

  async Sincronizar(): Promise<boolean> {
    let modal: HTMLIonLoadingElement;
    let loading = this.loadingController.create({
      spinner: 'circles',
      duration: 15000,
      message: 'Sincronizando...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
      id: 'cerrar'
    }).then(t => {
      modal = t;
      modal.present();
    });

    let outerThis = this;
    var promise = new Promise<boolean>(function (resolve, reject) {
      console.log("Se llama Inicio() de Sincronizar");
       outerThis.net.checkNetworkStatusNow().then(estoyConectado => {
        if (!estoyConectado) {
          outerThis.alert.Alerta("Debe estar conectado a internet para sincronizar");
          resolve(false);
        }      
        var arregloDePromesas = [];
        // Sincronizacion COORDENADAS
        var syncCoords =  outerThis.dbElecciones.GetCoordenadasUsuarios().then(async (data) => {
          var largo: number = data.LISTA_COORDENADAS.length;
          console.log('getcoordenadas :', data);
          if (largo > 0) {
             outerThis.eleccionesService.GuardarCoordenadasUsuario(data)
              .subscribe(
                async (info) => {
                  if (info.error.codigo == 0) {
                    await outerThis.dbElecciones.UpdateCoordenadasUsuarios();
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
        arregloDePromesas.push(promesaTipoLugares);
        
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

        let promesaCargas = new Promise((resolve, reject) => {
          outerThis.eleccionesService.ObtenerCargas().subscribe(data => {
            console.log("Obteniendo Cargas del servidor");
            if (data != null) {
              outerThis.dbElecciones.GuardarCargasLocal(data).then(data => {
                resolve();
                console.log("Cargas guardadas");
              }, error => {
                console.log("Ocurrió un error al guardar las Cargas localmente");
                reject();
              });
            } else {
              console.log("No se obtuvo respuesta de la API al obtener Cargas");
              reject();
            }
          })
        });
        arregloDePromesas.push(promesaCargas);

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

        /* */
        let promesaUniversoRutas = new Promise((resolverUniverso, rechazar) => {
          var arregloDePromesasRecepcionTablasRutas = [];
          var usr_string = localStorage.getItem("usuarioActual");
          var usuario = JSON.parse(usr_string).usuario;
          let parametros = {
            "USU_ID": usuario.USU_ID,
          }
          // Envío
          
          outerThis.dbElecciones.ObtenerRutasNoSincronizadas().then(data => {
            console.log('ObtenerRutasNoSincronizadas: ', data);
            // Acá se debe ir a consultar las demás tablas del universo rutas y
            // armar el JSON necesario para enviar a la API, que incluirá todas las tablas
            // asociadas a la ruta. 

            
            // Una vez realizado el envío de toda la información, se deben updatear todas las tablas
            // del universo rutas a SYNC = 1 (Sincronizadas)
            outerThis.dbElecciones.UpdateRutasSincronizadas().then(r => {
              
              // Finalmente comienza la recepción de datos. Una vez que ya terminamos de enviar todo, vamos a borrar las tablas locales
              // y recibir toda la data nuevamente.
              let promesaRutas = new Promise((resolve, reject) => {
                var usr_string = localStorage.getItem("usuarioActual");
                var usuario = JSON.parse(usr_string).usuario;
                let parametros = {
                  "USU_ID": usuario.USU_ID,
                }
                outerThis.eleccionesService.ObtenerRutas(parametros).subscribe(data => {
                  console.log("Obteniendo Rutas del servidor");
                  if (data != null) {
                    outerThis.dbElecciones.GuardarRutasLocal(data).then(data => {
                      resolve();
                      console.log("Rutas guardadas");
                    }, error => {
                      console.log("Ocurrió un error al guardar las Rutas localmente");
                      reject();
                    });
                  } else {
                    console.log("No se obtuvo respuesta de la API al obtener Rutas");
                    reject();
                  }
                });
              });
              arregloDePromesasRecepcionTablasRutas.push(promesaRutas);

              let promesaEstadosRutas = new Promise((resolve, reject) => {
                outerThis.eleccionesService.ObtenerEstadosRutas().subscribe(data => {
                  console.log("Obteniendo EstadosRutas del servidor");
                  if (data != null) {
                    outerThis.dbElecciones.GuardarEstadosRutasLocal(data).then(data => {
                      resolve();
                      console.log("EstadosRutas guardadas");
                    }, error => {
                      console.log("Ocurrió un error al guardar los EstadosRutas localmente");
                      reject();
                    });
                  } else {
                    console.log("No se obtuvo respuesta de la API al obtener EstadosRutas");
                    reject();
                  }
                })
              });
              
              arregloDePromesasRecepcionTablasRutas.push(promesaEstadosRutas);

              let promesaBitacoraRutas = new Promise((resolve, reject) => {
                var usr_string = localStorage.getItem("usuarioActual");
                var usuario = JSON.parse(usr_string).usuario;
                let parametros = {
                  "USU_ID": usuario.USU_ID,
                }
                outerThis.eleccionesService.ObtenerBitacoraRutas(parametros).subscribe(data => {
                  console.log("Obteniendo BitacoraRutas del servidor");
                  if (data != null) {
                    outerThis.dbElecciones.GuardarBitacoraRutasLocal(data).then(data => {
                      resolve();
                      console.log("BitacoraRutas guardadas");
                    }, error => {
                      console.log("Ocurrió un error al guardar las BitacoraRutas localmente");
                      reject();
                    });
                  } else {
                    console.log("No se obtuvo respuesta de la API al obtener BitacoraRutas");
                    reject();
                  }
                })
              });
              arregloDePromesasRecepcionTablasRutas.push(promesaBitacoraRutas);

              let promesaRutasCargas = new Promise((resolve, reject) => {
                var usr_string = localStorage.getItem("usuarioActual");
                var usuario = JSON.parse(usr_string).usuario;
                let parametros = {
                  "USU_ID": usuario.USU_ID,
                }
                outerThis.eleccionesService.ObtenerRutasCargas(parametros).subscribe(data => {
                  console.log("Obteniendo RutasCargas del servidor");
                  if (data != null) {
                    outerThis.dbElecciones.GuardarRutasCargasLocal(data).then(data => {
                      resolve();
                      console.log("RutasCargas guardadas");
                    }, error => {
                      console.log("Ocurrió un error al guardar las RutasCargas localmente");
                      reject();
                    });
                  } else {
                    console.log("No se obtuvo respuesta de la API al obtener RutasCargas");
                    reject();
                  }
                })
              });
              arregloDePromesasRecepcionTablasRutas.push(promesaRutasCargas);

              Promise.all(arregloDePromesasRecepcionTablasRutas).then(x => {
                  arregloDePromesasRecepcionTablasRutas = [];
                  // Una vez hicimos todos los envíos y todas las recepciones del universo rutas
                  // resolvemos la promesa. La sincronización de rutas y las tablas relacionadas
                  resolverUniverso();
              });
            }, error => {
              
              console.error(error);
            }); // Fin UpdateRutasSincronizadas.then
          }); // Fin ObtenerRutasSincronizadas.then
          
        }); // Fin promesaUniversoRutas
        arregloDePromesas.push(promesaUniversoRutas);
       
        

        // ============================== FIN SINCRONIZADORES ==============================
        console.log('outerThis.TableCoordenadasUsuario' ,outerThis.TableCoordenadasUsuario);

        Promise.all(arregloDePromesas).then(x => {
          arregloDePromesas = [];
          modal.dismiss(null, null);
          console.log("Cerrando el Spinner");
          resolve(true);
        }).catch(erro => {
          console.error("error :", erro);
        });
      })
    });
    return promise;

  }
}
