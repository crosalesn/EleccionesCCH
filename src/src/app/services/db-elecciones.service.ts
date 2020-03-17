import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { strictEqual } from 'assert';
import { IRegion } from '../interfaces/region.interface';
import { IProvincia } from '../interfaces/provincia.interface';
import { ITipoLugar } from '../interfaces/tipo_lugar.interface';

@Injectable({
  providedIn: 'root'
})
export class DbEleccionesService {

  private database: SQLiteObject = null;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  regiones = new BehaviorSubject([]);
  provincias = new BehaviorSubject([]);
  comnuas = new BehaviorSubject([]);
  tipoLugares = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    console.log('Se llama constructor de Db-Elecciones');
  }

  ObtenerRutasNoSincronizadas(): Promise<any> {
    return new Promise(resolve => { resolve(true); });

    // this.database.executeSql("SELECT * FROM RUTAS WHERE RTA_SYNC = 0", []);
  }

  async getAllRutasNoSync() {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM RUTAS WHERE RTA_SYNC = 0 ';
    await this.database.executeSql(query, []).then(async data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            RTA_ID: data.rows.item(i).RTA_ID,
            RTA_USUARIO_REGISTRO: data.rows.item(i).RTA_USUARIO_REGISTRO,
            RTA_FECHA_REGISTRO: data.rows.item(i).RTA_FECHA_REGISTRO,
            RTA_USUARIO_MODIFICACION: data.rows.item(i).RTA_USUARIO_MODIFICACION,
            RTA_FECHA_MODIFICACION: data.rows.item(i).RTA_FECHA_MODIFICACION,
            RTA_CODIGO: data.rows.item(i).RTA_CODIGO,
            ERU_ID: data.rows.item(i).ERU_ID,
            TRA_ID: data.rows.item(i).TRA_ID,
            USU_ID: data.rows.item(i).USU_ID,
            LUG_ID_ORIGEN: data.rows.item(i).LUG_ID_ORIGEN,
            LUG_ID_DESTINO: data.rows.item(i).LUG_ID_DESTINO,
            RTA_OS: data.rows.item(i).RTA_OS,
            RTA_LATITUD: data.rows.item(i).RTA_LATITUD,
            RTA_LONGITUD: data.rows.item(i).RTA_LONGITUD,
            RTA_FECHA_DISPOSITIVO: data.rows.item(i).RTA_FECHA_DISPOSITIVO
          });

        }
      }
    });

    return rutas;


  }

  UpdateRutasSincronizadas(): Promise<any> {
    return new Promise(resolve => { resolve(true); });
    // return this.database.executeSql("UPDATE RUTAS SET RTA_SYNC = 1", []);
  }

  GetFechaHora(horas?: boolean): string {

    // tslint:disable-next-line: prefer-const
    let date: any = new Date();
    let day: any = date.getDate();       // yields date
    let month: any = date.getMonth() + 1; // yields month (add one as '.getMonth()' is zero indexed)
    // tslint:disable-next-line: prefer-const
    let year: any = date.getFullYear();  // yields year
    let hour: any = date.getHours();     // yields hours
    let minute: any = date.getMinutes(); // yields minutes
    let second: any = date.getSeconds(); // yields seconds

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    // tslint:disable-next-line: prefer-const
    let fecha: string = year + '-' + month + '-' + day;
    // tslint:disable-next-line: prefer-const
    let fechayhora: string = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

    return (horas) ? fechayhora : fecha;
  }

  setDatabase(database: SQLiteObject) {
    if (this.database === null) {
      this.database = database;
    }
  }

  ImportacionDB() {
    console.log('Intentando obtener elecciones.sql');
    this.http.get('../../assets/bd/elecciones.sql', { responseType: 'text' })
      .subscribe(sql => {
        console.log('Se obtuvo elecciones.sql');
        console.log(this.database);
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            console.log('la importacion se realizó correctamente');
            // this.ObtenerRegionesLocal();
            // this.ObtenerTipoLugares();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  GetDatabaseState() {
    return this.dbReady.asObservable();
  }
  async BorrarUsuarioLocal() {
    await this.database.executeSql('DELETE FROM USUARIOS', []).then(() => {
      console.log('Usuarios borrado');
    }).catch(erro => {
      console.log('Error al borrar Usuarios borrado');
    });

  }

  async BorrarParametrosLocal() {
    return await this.database.executeSql('DELETE FROM PARAMETROS', []).then(data => {
      console.log('Parametros borrados');
    }).catch(err => {
      console.log('Error borrado Parametro');
    });
  }

  async Borrar(name: string) {


    return await this.database.executeSql('DELETE FROM ' + name, []).then(data => {
      console.log('tabla ' + name + ' borrada');
    }).catch(err => {
      console.log('Error borradondo ', name);
    });
  }

  async borrarBitacorasRutasSync() {

    return await this.database.executeSql('DELETE FROM BITACORA_RUTAS WHERE SYNC NOT IN (0) ', []).then(data => {
      console.log('tabla BITACORA_RUTAS borrada');
    }).catch(err => {
      console.log('Error borradondo BITACORA_RUTAS ');
    });
  }

  async borrarBitacorasRutasCargasSync() {

    return await this.database.executeSql('DELETE FROM BITACORA_RUTAS_CARGAS WHERE SYNC NOT IN (0) ', []).then(data => {
      console.log('tabla BITACORA_RUTAS_CARGAS borrada');
    }).catch(err => {
      console.log('Error borradondo BITACORA_RUTAS_CARGAS ');
    });
  }

  async BorrarPerfilesLocal() {
    return await this.database.executeSql('DELETE FROM PERFILES', []).then(() => {
      console.log('Perfiles borrado');
    }).catch(err => {
      console.log('Error al borrar Perfiles');
    });

  }

  BorraRegistroInicioFinDiaLocal() {
    return this.database.executeSql('DELETE FROM REGISTRO_INICIO_FIN_DIA', []).then(data => {
      console.log('REGISTRO_INICIO_FIN_DIA borrado');
    });
  }

  async BorrarAplicacionesLocal() {
    await this.database.executeSql('DELETE FROM APLICACIONES', []).catch(() => {
      console.log('Aplicaciones borrado');
    }).catch(err => {
      console.log('Error borrar Aplicaciones', err);
    });

  }

  async BorrarPerfilesAplicacionesLocal() {
    await this.database.executeSql('DELETE FROM PERFILES_APLICACIONES', []).then(() => {
      console.log('Perfiles_Aplicaciones borrado');
    }).catch(err => {
      console.log('error borrador Perfiles_Aplicaciones', err);
    });

  }

  AgregarUsuarioLocal(parametro) {
    console.log('Se ejecuta la funcion AgregarUsuarioLocal del archivo db-elecciones.service.ts');
    const data = [parametro.usuario.USU_CLAVE, parametro.usuario.USU_NOMBRE_USUARIO];
    return this.database.executeSql('SELECT USU_ID FROM USUARIOS WHERE USU_CLAVE = ? AND USU_NOMBRE_USUARIO = ?', data).then(data => {
      if (data.rows.length > 0) {
        console.log('Usuario ya existe');
      } else {
        const USU_FECHA_REGISTRO = this.GetFechaHora();
        const usuario = [
          parseInt(parametro.usuario.USU_ID, 10),
          parseInt(parametro.usuario.USU_RUT, 10),
          parametro.usuario.USU_DV,
          parametro.usuario.USU_NOMBRES,
          parametro.usuario.USU_APELLIDO_PATERNO,
          parametro.usuario.USU_APELLIDO_MATERNO,
          parametro.usuario.USU_FECHA_NACIMIENTO,
          parametro.usuario.USU_NOMBRE_USUARIO,
          parametro.usuario.USU_CLAVE,
          USU_FECHA_REGISTRO,
          parseInt(parametro.usuario.USU_ESTADO, 10),
          parseInt(parametro.usuario.PER_ID, 10),

          parseInt(parametro.usuario.REG_ID, 10),

          parseInt(parametro.usuario.LUGAR_ASIGNADO_ID, 10),
          parametro.usuario.USU_CODIGO_RESET_CONTRASENA,
          parametro.usuario.USU_TELEFONO,
          parseInt(parametro.usuario.TUS_ID, 10),
          parseInt(parametro.usuario.ETR_ID, 10)
        ];

        const perfil = [
          parseInt(parametro.usuario.PER_ID, 10),
          parametro.usuario.PER_CODIGO,
          parametro.usuario.PER_NOMBRE,
          parametro.usuario.PER_DESCRIPCION,
          parametro.usuario.PER_ESTADO
        ];

        return this.database.executeSql('INSERT INTO PERFILES '
          + '(PER_ID,'
          + 'PER_CODIGO,'
          + 'PER_NOMBRE,'
          + 'PER_DESCRIPCION,'
          + 'PER_ESTADO) '
          + 'VALUES (?, ?, ?, ?, ?)',
          perfil).then(data => {
            console.log('Perfil guardado');
            return this.database.executeSql('INSERT INTO USUARIOS '
              + '(USU_ID, '
              + 'USU_RUT, '
              + 'USU_DV, '
              + 'USU_NOMBRES,'
              + 'USU_APELLIDO_PATERNO, '
              + 'USU_APELLIDO_MATERNO, '
              + 'USU_FECHA_NACIMIENTO, '
              + 'USU_NOMBRE_USUARIO,'
              + 'USU_CLAVE, '
              + 'USU_FECHA_REGISTRO, '
              + 'USU_ESTADO, PER_ID, '
              + 'REG_ID, LUGAR_ASIGNADO_ID, USU_CODIGO_RESET_CONTRASENA, '
              + 'USU_TELEFONO, TUS_ID, ETR_ID) '
              + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              usuario).then(data => {
                console.log('Usuario guardado: ' + JSON.stringify(parametro.usuario));
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < parametro.aplicaciones.length; i++) {
                  ((param) => {
                    const tempAplicaciones = [
                      parseInt(param.APLI_ID),
                      param.APLI_CODIGO,
                      param.APLI_NOMBRE,
                      param.APLI_DESCRIPCION,
                      parseInt(param.APLI_ESTADO),
                      param.APLI_IMG,
                      parseInt(param.TAP_ID),
                      param.APLI_METODO,
                      param.APLI_CONTROLADOR
                    ];

                    this.database.executeSql('INSERT INTO APLICACIONES (APLI_ID, '
                      + 'APLI_CODIGO, '
                      + 'APLI_NOMBRE, '
                      + 'APLI_DESCRIPCION, '
                      + 'APLI_ESTADO,'
                      + 'APLI_IMG,'
                      + 'TAP_ID,'
                      + 'APLI_METODO,'
                      + 'APLI_CONTROLADOR) '
                      + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      tempAplicaciones).then(data => {
                        console.log('Aplicacion guardada');
                        console.log(tempAplicaciones);
                        this.database.executeSql('INSERT INTO PERFILES_APLICACIONES ('
                          + 'PER_ID,'
                          + 'APLI_ID)'
                          + ' VALUES '
                          + '(?, ?)',
                          [parametro.usuario.PER_ID, param.APLI_ID]).then(data => {
                            console.log(parametro.usuario.PER_ID);
                            console.log(param.APLI_ID);
                            console.log('Perfiles_Aplicaciones guardados');
                          });
                      });

                  })(parametro.aplicaciones[i]);
                }
              });
          });
      }
    });
  }

  GuardarRegionesLocal(regiones): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM REGIONES'));
      for (let j = 0; j < regiones.length; j++) {
        ((singleRegion) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO REGIONES ' +
            '(REG_ID, REG_CODIGO, REG_NOMBRE) VALUES (?,?,?)',
            [singleRegion.REG_ID, singleRegion.REG_CODIGO, singleRegion.REG_NOMBRE]).then(data => {
              console.log('Region insertada: ' + JSON.stringify(singleRegion));
            })
          );
        })(regiones[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  ObtenerRegionesLocal() {
    const query = 'SELECT * FROM REGIONES';
    return this.database.executeSql(query, []).then(data => {
      let regiones: IRegion[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          regiones.push({
            regId: data.rows.item(i).REG_ID,
            regCodigo: data.rows.item(i).REG_CODIGO,
            regNombre: data.rows.item(i).REG_NOMBRE
          });
        }
      }
      this.regiones.next(regiones);
    });
  }

  async ObtenerRegiones() {
    const query = 'SELECT * FROM REGIONES';
    let regiones: IRegion[] = [];
    await this.database.executeSql(query, []).then(data => {

      if (data.rows.length > 0) {
        // tslint:disable-next-line: no-var-keyword
        for (var i = 0; i < data.rows.length; i++) {
          regiones.push({
            regId: data.rows.item(i).REG_ID,
            regCodigo: data.rows.item(i).REG_CODIGO,
            regNombre: data.rows.item(i).REG_NOMBRE
          });
        }
      }
    });
    return regiones;
  }

  GuardarProvinciasLocal(provincias): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM PROVINCIAS'));
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < provincias.length; j++) {
        ((singleProvince) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO PROVINCIAS ' +
            '(PRO_ID, PRO_NOMBRE, REG_ID, PRO_CODIGO) VALUES (?,?,?,?)',
            [singleProvince.PRO_ID, singleProvince.PRO_NOMBRE, singleProvince.REG_ID, singleProvince.PRO_CODIGO]).then(data => {
              console.log('Provincia insertada:' + JSON.stringify(singleProvince));
            })
          );
        })(provincias[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  ObtenerProvinciasPorRegion(region: IRegion) {
    let idRegion = region.regId;
    console.log('service:', region);
    let provincias: IProvincia[] = [];
    const promise = new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM PROVINCIAS WHERE REG_ID = ?', [idRegion]).then(data => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            provincias.push({
              proCodigo: data.rows.item(i).PRO_CODIGO,
              proId: data.rows.item(i).PRO_ID,
              proNombre: data.rows.item(i).PRO_NOMBRE,
              regid: data.rows.item(i).REG_ID
            });
          }
        }
        resolve(provincias);
      });

    });
    return promise;
  }

  GuardarComunasLocal(comunas): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM COMUNAS'));
      for (let j = 0; j < comunas.length; j++) {
        ((singleComune) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO COMUNAS ' +
            '(COM_ID, COM_NOMBRE, PRO_ID, COM_CODIGO) VALUES (?,?,?,?)',
            [singleComune.COM_ID, singleComune.COM_NOMBRE, singleComune.PRO_ID, singleComune.COM_CODIGO]).then(data => {
              console.log('Comuna insertada:' + JSON.stringify(singleComune));
            })
          );
        })(comunas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  ObtenerComunasPorProvincias(idProv: number) {
    const query = 'SELECT * FROM COMUNAS WHERE PRO_ID = ? ';
    const promise = new Promise((resolve, reject) => {
      this.database.executeSql(query, [idProv]).then(data => {
        let comunas = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            comunas.push({
              COM_ID: data.rows.item(i).COM_ID,
              COM_NOMBRE: data.rows.item(i).COM_NOMBRE,
              PRO_ID: data.rows.item(i).PRO_ID,
              COM_CODIGO: data.rows.item(i).COM_CODIGO,
            });
          }
        }
        resolve(comunas);
      });
    });
    return promise;

  }
  async ObtenerComunasPorId(idCom: number) {
    const query = 'SELECT * FROM COMUNAS WHERE COM_ID = ? ';
    var comunas = [];
    await this.database.executeSql(query, [idCom]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          comunas.push({
            COM_ID: data.rows.item(i).COM_ID,
            COM_NOMBRE: data.rows.item(i).COM_NOMBRE,
            PRO_ID: data.rows.item(i).PRO_ID,
            COM_CODIGO: data.rows.item(i).COM_CODIGO,
          });
        }
      }
    });

    return comunas;
  }

  GuardarTipoLugaresLocal(tipoLugares): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM TIPO_LUGARES'));
      for (let j = 0; j < tipoLugares.length; j++) {
        ((singlePlaceType) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO TIPO_LUGARES ' +
            '(TIL_ID, TIL_CODIGO, TIL_NOMBRE, TIL_DESCRIPCION, TIL_ESTADO) VALUES (?,?,?,?,?)', [singlePlaceType.TIL_ID, singlePlaceType.TIL_CODIGO, singlePlaceType.TIL_DESCRIPCION, singlePlaceType.TIL_ESTADO]).then(data => {
              console.log('Tipo Lugar insertado:' + JSON.stringify(singlePlaceType));
            })
          );
        })(tipoLugares[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  async ObtenerTipoLugares() {
    const query = 'SELECT * FROM TIPO_LUGARES';
    // tslint:disable-next-line: prefer-const
    let tipoLugares: ITipoLugar[] = [];
    await this.database.executeSql(query, []).then(data => {

      if (data.rows.length > 0) {
        // tslint:disable-next-line: no-var-keyword
        for (var i = 0; i < data.rows.length; i++) {
          tipoLugares.push({
            tilId: data.rows.item(i).TIL_ID,
            tilCodigo: data.rows.item(i).TIL_CODIGO,
            tilNombre: data.rows.item(i).TIL_NOMBRE,
            tilDesripcion: data.rows.item(i).TIL_DESCRIPCION,
            tilEstado: data.rows.item(i).TIL_ESTADO,
          });
        }
      }
    });
    return tipoLugares;
  }

  GuardarLugaresLocal(lugares): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM LUGARES'));
      for (let j = 0; j < lugares.length; j++) {
        ((singlePlace) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO LUGARES ' +
            '(LUG_ID, LUG_NOMBRE, COM_ID, LUG_CALLE, LUG_CALLE, LUG_NUMERO, LUG_LATITUD, LUG_LONGITUD, LUG_DESCRIPCION, TIL_ID) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [singlePlace.LUG_ID, singlePlace.LUG_NOMBRE, singlePlace.COM_ID, singlePlace.LUG_CALLE, singlePlace.LUG_NUMERO, singlePlace.LUG_LATITUD, singlePlace.LUG_LONGITUD, singlePlace.LUG_DESCRIPCION, singlePlace.TIL_ID]).then(data => {
              console.log('Lugar insertado:' + JSON.stringify(singlePlace));
            })
          );
        })(lugares[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }
  async getAllLugares() {
    let query = 'SELECT * FROM LUGARES ';
    let lugares = [];
    await this.database.executeSql(query, []).then(dato => {
      console.log('query dato:', dato);
      if (dato.rows.length > 0) {
        for (let i = 0; i < dato.rows.length; i++) {
          lugares.push({
            LUG_ID: dato.rows.item(i).LUG_ID,
            LUG_CODIGO: dato.rows.item(i).LUG_CODIGO,
            LUG_NOMBRE: dato.rows.item(i).LUG_NOMBRE,
            COM_ID: dato.rows.item(i).COM_ID,
            LUG_CALLE: dato.rows.item(i).LUG_CALLE,
            LUG_NUMERO: dato.rows.item(i).LUG_NUMERO,
            LUG_LATITUD: dato.rows.item(i).LUG_LATITUD,
            LUG_LONGITUD: dato.rows.item(i).LUG_LONGITUD,
            LUG_DESCRIPCION: dato.rows.item(i).LUG_DESCRIPCION,
            TIL_ID: dato.rows.item(i).TIL_ID
          });
        }
      }
    });
    return lugares;
  }

  async getAllLugaresById(id) {
    let query = 'SELECT * FROM LUGARES WHERE LUG_ID = ? ';
    let lugares = [];
    await this.database.executeSql(query, [id]).then(async dato => {
      if (dato.rows.length > 0) {
        for (let i = 0; i < dato.rows.length; i++) {
          lugares.push({
            LUG_ID: dato.rows.item(i).LUG_ID,
            LUG_CODIGO: dato.rows.item(i).LUG_CODIGO,
            LUG_NOMBRE: dato.rows.item(i).LUG_NOMBRE,
            COM_ID: await this.ObtenerComunasPorId(dato.rows.item(i).COM_ID),
            LUG_CALLE: dato.rows.item(i).LUG_CALLE,
            LUG_NUMERO: dato.rows.item(i).LUG_NUMERO,
            LUG_LATITUD: dato.rows.item(i).LUG_LATITUD,
            LUG_LONGITUD: dato.rows.item(i).LUG_LONGITUD,
            LUG_DESCRIPCION: dato.rows.item(i).LUG_DESCRIPCION,
            TIL_ID: dato.rows.item(i).TIL_ID
          });
        }
      }
    });
    return lugares;
  }

  async ObtenerLugarByComuna(idComnuna) {
    let query = 'SELECT * FROM LUGARES WHERE COM_ID = ? ';
    let lugares = [];
    await this.database.executeSql(query, [idComnuna]).then(dato => {
      if (dato.rows.length > 0) {
        for (let i = 0; i < dato.rows.length; i++) {
          lugares.push({
            LUG_ID: dato.rows.item(i).LUG_ID,
            LUG_CODIGO: dato.rows.item(i).LUG_CODIGO,
            LUG_NOMBRE: dato.rows.item(i).LUG_NOMBRE,
            COM_ID: dato.rows.item(i).COM_ID,
            LUG_CALLE: dato.rows.item(i).LUG_CALLE,
            LUG_NUMERO: dato.rows.item(i).LUG_NUMERO,
            LUG_LATITUD: dato.rows.item(i).LUG_LATITUD,
            LUG_LONGITUD: dato.rows.item(i).LUG_LONGITUD,
            LUG_DESCRIPCION: dato.rows.item(i).LUG_DESCRIPCION,
            TIL_ID: dato.rows.item(i).TIL_ID
          });
        }
      }
    });
    return lugares;
  }
  GuardarCargasLocal(cargas): Promise<any> {
    console.log('cargas: ', cargas);
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM CARGAS'));
      for (let j = 0; j < cargas.length; j++) {
        ((singleLoad) => {
          console.log('INSERTANDO CARGA')
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO CARGAS ' +
            `(
              CAR_ID,TVO_ID,CAR_CODIGO,CAR_BARRA,TCG_ID,CAR_BARRA_PALLET,CAR_BARRA_CUBETA,
              CAR_BARRA_BOLSA,CAR_FECHA_REGISTRO,CAR_USUARIO_CREACION,CAR_FECHA_MODIFICACION,
              CAR_USUARIO_MODIFICACION,MES_ID,LUG_ID,CAR_NOMBRE,CAR_DESCRIPCION,ECA_ID,TRC_ID,TDC_ID
            )`
            +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
              singleLoad.CAR_ID,
              singleLoad.TVO_ID,
              singleLoad.CAR_CODIGO,
              singleLoad.CAR_BARRA,
              singleLoad.TCG_ID,
              singleLoad.CAR_BARRA_PALLET,
              singleLoad.CAR_BARRA_CUBETA,
              singleLoad.CAR_BARRA_BOLSA,
              singleLoad.CAR_FECHA_REGISTRO,
              singleLoad.CAR_USUARIO_CREACION,
              singleLoad.CAR_FECHA_MODIFICACION,
              singleLoad.CAR_USUARIO_MODIFICACION,
              singleLoad.MES_ID,
              singleLoad.LUG_ID,
              singleLoad.CAR_NOMBRE,
              singleLoad.CAR_DESCRIPCION,
              singleLoad.ECA_ID,
              singleLoad.TRC_ID,
              singleLoad.TDC_ID
            ]).then(data => {
              console.log('CARGA insertada:' + JSON.stringify(singleLoad));
            }).catch(erro => {
              console.error('error al insertar cargas, ', erro);
            })
          );
        })(cargas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  async ObtenerCargas() {
    let query = 'SELECT * FROM CARGAS';
    let cargas = [];
    await this.database.executeSql(query, []).then(dato => {
      if (dato.rows.length > 0) {
        for (let i = 0; i < dato.rows.length; i++) {
          cargas.push({
            CAR_ID: dato.rows.item(i).CAR_ID,
            TVO_ID: dato.rows.item(i).TVO_ID,
            CAR_CODIGO: dato.rows.item(i).CAR_CODIGO,
            CAR_BARRA: dato.rows.item(i).CAR_BARRA,
            TCG_TD: dato.rows.item(i).TCG_TD,
            CAR_BARRA_PALLET: dato.rows.item(i).CAR_BARRA_PALLET,
            CAR_BARRA_CUBETA: dato.rows.item(i).CAR_BARRA_CUBETA,
            CAR_BARRA_BOLSA: dato.rows.item(i).CAR_BARRA_BOLSA,
            CAR_FECHA_REGISTRO: dato.rows.item(i).CAR_FECHA_REGISTRO,
            CAR_USUARIO_CREACION: dato.rows.item(i).CAR_USUARIO_CREACION,
            CAR_FECHA_MODIFICACION: dato.rows.item(i).CAR_FECHA_MODIFICACION,
            CAR_USUARIO_MODIFICACION: dato.rows.item(i).CAR_USUARIO_MODIFICACION,
            MES_ID: dato.rows.item(i).MES_ID,
            LUG_ID: dato.rows.item(i).LUG_ID,
            CAR_NOMBRE: dato.rows.item(i).CAR_NOMBRE,
            CAR_DESCRIPCION: dato.rows.item(i).CAR_DESCRIPCION,
            ECA_ID: dato.rows.item(i).ECA_ID,
            TRC_ID: dato.rows.item(i).TRC_ID,
            TDC_ID: dato.rows.item(i).TDC_ID
          });
        }
      }
    });
    return cargas;
  }

  async ObtenerCargaByCodigo(codigo: string) {
    let query = 'SELECT * FROM CARGAS WHERE CAR_BARRA = ? ';
    let cargas = [];
    await this.database.executeSql(query, [codigo]).then(dato => {
      console.log('cargaescanaeada cod ' + codigo + ': ' + dato.rows.item);
      if (dato.rows.length > 0) {
        for (let i = 0; i < dato.rows.length; i++) {
          cargas.push({
            CAR_ID: dato.rows.item(i).CAR_ID,
            TVO_ID: dato.rows.item(i).TVO_ID,
            CAR_CODIGO: dato.rows.item(i).CAR_CODIGO,
            CAR_BARRA: dato.rows.item(i).CAR_BARRA,
            TCG_TD: dato.rows.item(i).TCG_TD,
            CAR_BARRA_PALLET: dato.rows.item(i).CAR_BARRA_PALLET,
            CAR_BARRA_CUBETA: dato.rows.item(i).CAR_BARRA_CUBETA,
            CAR_BARRA_BOLSA: dato.rows.item(i).CAR_BARRA_BOLSA,
            CAR_FECHA_REGISTRO: dato.rows.item(i).CAR_FECHA_REGISTRO,
            CAR_USUARIO_CREACION: dato.rows.item(i).CAR_USUARIO_CREACION,
            CAR_FECHA_MODIFICACION: dato.rows.item(i).CAR_FECHA_MODIFICACION,
            CAR_USUARIO_MODIFICACION: dato.rows.item(i).CAR_USUARIO_MODIFICACION,
            MES_ID: dato.rows.item(i).MES_ID,
            LUG_ID: dato.rows.item(i).LUG_ID,
            CAR_NOMBRE: dato.rows.item(i).CAR_NOMBRE,
            CAR_DESCRIPCION: dato.rows.item(i).CAR_DESCRIPCION,
            ECA_ID: dato.rows.item(i).ECA_ID,
            TRC_ID: dato.rows.item(i).TRC_ID,
            TDC_ID: dato.rows.item(i).TDC_ID
          });
        }
      }
    });
    return cargas;
  }

  GuardarEmpresasTransporteLocal(empresaTransporte): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM EMPRESAS_TRANSPORTES'));
      arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO EMPRESAS_TRANSPORTES ' +
        '(ETR_ID, ETR_CODIGO, ETR_NOMBRE, ETR_DESCRIPCION, ETR_RUT, ETR_DV, ETR_TELEFONO) VALUES (?,?,?,?,?,?,?)',
        [empresaTransporte.ETR_ID, empresaTransporte.ETR_CODIGO, empresaTransporte.ETR_NOMBRE, empresaTransporte.ETR_DESCRIPCION, empresaTransporte.ETR_RUT, empresaTransporte.ETR_DV, empresaTransporte.ETR_TELEFONO]).then(data => {
          console.log('Empresa de Transporte insertada:' + JSON.stringify(empresaTransporte));
        })
      );
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  GuardarTransportesLocal(transportes): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM TRANSPORTES'));
      for (let j = 0; j < transportes.length; j++) {
        ((singleTransport) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO TRANSPORTES ' +
            '(TRA_ID, TRA_PATENTE, TRA_NOMBRE, TRA_DESCRIPCION, ETR_ID, REG_ID, TIT_ID) VALUES (?,?,?,?,?,?,?)',
            [singleTransport.TRA_ID, singleTransport.TRA_PATENTE, singleTransport.TRA_NOMBRE, singleTransport.TRA_DESCRIPCION, singleTransport.ETR_ID, singleTransport.REG_ID, singleTransport.TIT_ID]).then(data => {
              console.log('Transporte insertado:' + JSON.stringify(singleTransport));
            })
          );
        })(transportes[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  GuardarRutasLocal(rutas): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM RUTAS WHERE SYNC NOT IN (0)'));
      for (let j = 0; j < rutas.length; j++) {
        ((singleRoute) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO RUTAS ' +
            '(RTA_ID, RTA_USUARIO_REGISTRO, RTA_FECHA_REGISTRO, RTA_USUARIO_MODIFICACION, RTA_FECHA_MODIFICACION,' +
            ' RTA_CODIGO, ERU_ID, TRA_ID, USU_ID, LUG_ID_ORIGEN, LUG_ID_DESTINO, RTA_OS, RTA_LATITUD, RTA_LONGITUD,' +
            ' RTA_FECHA_DISPOSITIVO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [singleRoute.RTA_ID, singleRoute.RTA_USUARIO_REGISTRO, singleRoute.RTA_FECHA_REGISTRO, singleRoute.RTA_USUARIO_MODIFICACION,
            singleRoute.RTA_FECHA_MODIFICACION, singleRoute.RTA_CODIGO, singleRoute.ERU_ID, singleRoute.TRA_ID, singleRoute.USU_ID,
            singleRoute.LUG_ID_ORIGEN, singleRoute.LUG_ID_DESTINO, singleRoute.RTA_OS,
            singleRoute.RTA_LATITUD, singleRoute.RTA_LONGITUD,
            singleRoute.RTA_FECHA_DISPOSITIVO]).then(data => {
              console.log('Ruta insertada:' + JSON.stringify(singleRoute));
            })
          );
        })(rutas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  async insertarRuta(ruta) {
    // tslint:disable-next-line: no-var-keyword
    var id = 0;
    console.log('ruta db insertar', ruta);
    const query = `INSERT INTO RUTAS
      (
        ERU_ID,
        TRA_ID,
        USU_ID,
        LUG_ID_ORIGEN,
        LUG_ID_DESTINO,
        RTA_LATITUD,
        RTA_LONGITUD,
        RTA_FECHA_DISPOSITIVO,
        RTA_SYNC
      )
      VALUES (?,?,?,?,?,?,?,?,?)
    `;
    await this.database.executeSql(query, [
      ruta.ERU_ID,
      ruta.TRA_ID,
      ruta.USU_ID,
      ruta.LUG_ID_ORIGEN,
      ruta.LUG_ID_DESTINO,
      ruta.RTA_LATITUD,
      ruta.RTA_LONGITUD,
      ruta.RTA_FECHA_DISPOSITIVO,
      ruta.RTA_SYNC
    ]).then(data => {
      id = data.insertId;
      console.log('idRutaInsertado: ', data.insertId);
    }).catch(err => {
      console.error('error al insertar ruta :', err);
    });
    return id;
  }

  async insertarRutaCarga(carga) {
    var idRutaCarga = 0;
    console.log('idRutaCarga db insertar', carga);
    const query = `INSERT INTO RUTAS_CARGAS
      (
        CAR_ID,
        RTA_ID,
        CAR_RTA_ESTADO,
        SYNC
      )
      VALUES (?,?,?,?)
    `;
    await this.database.executeSql(query, [
      carga.CAR_ID,
      carga.RTA_ID,
      carga.CAR_RTA_ESTADO,
      carga.SYNC
    ]).then(data => {
      idRutaCarga = data.insertId;
      console.log('idRutaCarga: ', data.insertId);
    }).catch(err => {
      console.error('error al insertar rutaCarga :', err);
    });
    return idRutaCarga;
  }

  async getRutaCargaByIdRuta(idRuta) {
    var cargasRutas = [];
    const query = `SELECT * FROM RUTAS_CARGAS WHERE RTA_ID = ?`;
    await this.database.executeSql(query, [idRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          cargasRutas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            RTA_ID: data.rows.item(i).RTA_ID,

          });
        }
      }
    }).catch(err => {
      console.error('error al insertar rutaCarga :', err);
    });

    return cargasRutas;
  }

  async getAllRutasCargas() {
    var rutasCargas = [];
    const query = `SELECT * FROM RUTAS_CARGAS`;
    await this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutasCargas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            RTA_ID: data.rows.item(i).RTA_ID
          });
        }
      }
    }).catch(err => {
      console.error('error al insertar RUTAS_CARGAS :', err);
    });

    return rutasCargas;
  }

  async insertarBitacoraRuta(bitacoraRuta) {
    // tslint:disable-next-line: no-var-keyword
    var idBitacoraRuta = 0;
    console.log('BitacoraRuta db insertar', bitacoraRuta);
    const query = `INSERT INTO BITACORA_RUTAS
      (
        BRU_FECHA_REGISTRO_DISPOSITIVO,
        BRU_USUARIO_REGISTRO,
        BRU_LATITUD,
        BRU_LONGITUD,
        ERU_ID,
        BRU_DESCRIPCION,
        RTA_ID,
        SYNC
      )
      VALUES (?,?,?,?,?,?,?,?)
    `;
    await this.database.executeSql(query, [
      bitacoraRuta.BRU_FECHA_REGISTRO_DISPOSITIVO,
      bitacoraRuta.BRU_USUARIO_REGISTRO,
      bitacoraRuta.BRU_LATITUD,
      bitacoraRuta.BRU_LONGITUD,
      bitacoraRuta.ERU_ID,
      bitacoraRuta.BRU_DESCRIPCION,
      bitacoraRuta.RTA_ID,
      bitacoraRuta.SYNC
    ]).then(data => {
      idBitacoraRuta = data.insertId;
      console.log('idBitacoraRuta: ', data.insertId);
    }).catch(err => {
      console.error('error al insertar bitacoraRuta :', err);
    });
    return idBitacoraRuta;
  }

  async insertarBitacoraRutaCarga(bitacoraRutaCarga) {
    // tslint:disable-next-line: no-var-keyword
    var idBitacoraRutaCarga = 0;
    console.log('BITACORA_RUTAS_CARGAS db insertar', bitacoraRutaCarga);
    const query = `INSERT INTO BITACORA_RUTAS_CARGAS
      (
        CAR_ID,
        BRU_ID,
        SYNC
      )
      VALUES (?,?,?)
    `;
    await this.database.executeSql(query, [
      bitacoraRutaCarga.CAR_ID,
      bitacoraRutaCarga.BRU_ID,
      bitacoraRutaCarga.SYNC
    ]).then(data => {
      idBitacoraRutaCarga = data.insertId;
      console.log('idBitacoraRutaCargaBD: ', data.insertId);
    }).catch(err => {
      console.error('error al insertar idBitacoraRutaCarga :', err);
    });
    return idBitacoraRutaCarga;
  }

  async obtenerRutas() {
    let rutas: any[] = [];
    let query = 'SELECT * FROM RUTAS';
    await this.database.executeSql(query, []).then(async data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            RTA_ID: data.rows.item(i).RTA_ID,
            RTA_USUARIO_REGISTRO: data.rows.item(i).RTA_USUARIO_REGISTRO,
            RTA_FECHA_REGISTRO: data.rows.item(i).RTA_FECHA_REGISTRO,
            RTA_USUARIO_MODIFICACION: data.rows.item(i).RTA_USUARIO_MODIFICACION,
            RTA_FECHA_MODIFICACION: data.rows.item(i).RTA_FECHA_MODIFICACION,
            RTA_CODIGO: data.rows.item(i).RTA_CODIGO,
            ERU_ID: data.rows.item(i).ERU_ID,
            TRA_ID: await this.obtenerTransportesById(data.rows.item(i).TRA_ID),
            USU_ID: data.rows.item(i).USU_ID,
            LUG_ID_ORIGEN: await this.getAllLugaresById(data.rows.item(i).LUG_ID_ORIGEN),
            LUG_ID_DESTINO: await this.getAllLugaresById(data.rows.item(i).LUG_ID_DESTINO),
            RTA_OS: data.rows.item(i).RTA_OS,
            RTA_LATITUD: data.rows.item(i).RTA_LATITUD,
            RTA_LONGITUD: data.rows.item(i).RTA_LONGITUD,
            RTA_FECHA_DISPOSITIVO: data.rows.item(i).RTA_FECHA_DISPOSITIVO,
            RTA_SYNC: data.rows.item(i).RTA_SYNC,
          });

        }
      }
    });

    return rutas;
  }

  async obtenerLugarById() {

  }

  async obtenerRutasCargas() {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM RUTAS_CARGAS';
    await this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            RTA_ID: data.rows.item(i).RTA_ID,
            CAR_RTA_ESTADO: data.rows.item(i).CAR_RTA_ESTADO,
            SYNC: data.rows.item(i).SYNC
          });
        }
      }
    });

    return rutas;
  }

  async obtenerRutasCargasByIdRuta(idRuta) {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM RUTAS_CARGAS WHERE RTA_ID = ? ';
    await this.database.executeSql(query, [idRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            RTA_ID: data.rows.item(i).RTA_ID
          });
        }
      }
    });

    return rutas;
  }

  async obtenerBitacorasRutasCargas() {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS_CARGAS';
    await this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            BRU_ID: data.rows.item(i).BRU_ID,
            SYNC: data.rows.item(i).SYNC,
          });
        }
      }
    });

    return rutas;
  }

  async obtenerBitacorasRutasCargasByIdBitacoraRuta(idBitacoraRuta) {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS_CARGAS WHERE BRU_ID = ?';
    await this.database.executeSql(query, [idBitacoraRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            CAR_ID: data.rows.item(i).CAR_ID,
            BRU_ID: data.rows.item(i).BRU_ID,
            SYNC: data.rows.item(i).SYNC,
          });
        }
      }
    });
    return rutas;
  }
  async obtenerBitacoraRutasImgByIdBitacoraRuta(idBitacoraRuta) {
    // tslint:disable-next-line: prefer-const
    let bitacoraRutasImgs: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS_IMAGENES WHERE BRU_ID = ?';
    await this.database.executeSql(query, [idBitacoraRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          bitacoraRutasImgs.push({
            BRU_ID: data.rows.item(i).BRU_ID,
            BRI_RUTA: data.rows.item(i).BRI_RUTA,
            BRI_NOMBRE: data.rows.item(i).BRI_NOMBRE
          });
        }
      }
    });
    return bitacoraRutasImgs;
  }

  async obtenerBitacoraRutasImgNoCargadaByIdBitacoraRuta(idBitacoraRuta) {
    // tslint:disable-next-line: prefer-const
    let bitacoraRutasImgsNo: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS_CARGAS_NOREGISTRADAS WHERE BRU_ID = ?';
    await this.database.executeSql(query, [idBitacoraRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          bitacoraRutasImgsNo.push({
            BRC_ID: data.rows.item(i).BRC_ID,
            BRC_CODIGO_BARRA: data.rows.item(i).BRC_CODIGO_BARRA,
            BRU_ID: data.rows.item(i).BRU_ID
          });
        }
      }
    });
    return bitacoraRutasImgsNo;
  }

  async obtenerBitacoraRutas() {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS';
    await this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            BRU_ID: data.rows.item(i).BRU_ID,
            BRU_FECHA_REGISTRO_DISPOSITIVO: data.rows.item(i).BRU_FECHA_REGISTRO_DISPOSITIVO,
            BRU_USUARIO_REGISTRO: data.rows.item(i).BRU_USUARIO_REGISTRO,
            BRU_LATITUD: data.rows.item(i).BRU_LATITUD,
            BRU_LONGITUD: data.rows.item(i).BRU_LONGITUD,
            ERU_ID: data.rows.item(i).ERU_ID,
            BRU_CUADRADO: data.rows.item(i).BRU_CUADRADO,
            BRU_DESCRIPCION: data.rows.item(i).BRU_DESCRIPCION,
            RTA_ID: data.rows.item(i).RTA_ID,
            BRU_FECHA_REGISTRO: data.rows.item(i).BRU_FECHA_REGISTRO,
            SYNC: data.rows.item(i).SYNC
          });
        }
      }
    });
    return rutas;
  }


  async obtenerBitacoraRutasByIdRuta(idRuta) {
    // tslint:disable-next-line: prefer-const
    let rutas: any[] = [];
    const query = 'SELECT * FROM BITACORA_RUTAS WHERE RTA_ID = ?';
    await this.database.executeSql(query, [idRuta]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          rutas.push({
            BRU_ID: data.rows.item(i).BRU_ID,
            BRU_FECHA_REGISTRO_DISPOSITIVO: data.rows.item(i).BRU_FECHA_REGISTRO_DISPOSITIVO,
            BRU_USUARIO_REGISTRO: data.rows.item(i).BRU_USUARIO_REGISTRO,
            BRU_LATITUD: data.rows.item(i).BRU_LATITUD,
            BRU_LONGITUD: data.rows.item(i).BRU_LONGITUD,
            ERU_ID: data.rows.item(i).ERU_ID,
            BRU_CUADRADO: data.rows.item(i).BRU_CUADRADO,
            BRU_DESCRIPCION: data.rows.item(i).BRU_DESCRIPCION,
            RTA_ID: data.rows.item(i).RTA_ID,
            BRU_FECHA_REGISTRO: data.rows.item(i).BRU_FECHA_REGISTRO
            //SYNC: data.rows.item(i).SYNC
          });
        }
      }
    });
    return rutas;
  }

  GuardarEstadosRutasLocal(estadosRutas): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM ESTADOS_RUTAS WHERE SYNC NOT IN (0)'));
      for (let j = 0; j < estadosRutas.length; j++) {
        ((singleRouteState) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO ESTADOS_RUTAS ' +
            '(ERU_ID, ERU_NOMBRE, ERU_DESCRIPCION, ERU_CODIGO) VALUES (?,?,?,?)',
            [singleRouteState.ERU_ID, singleRouteState.ERU_NOMBRE, singleRouteState.ERU_DESCRIPCION, singleRouteState.ERU_CODIGO]).then(data => {
              console.log('Ruta insertada:' + JSON.stringify(singleRouteState));
            })
          );
        })(estadosRutas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  GuardarBitacoraRutasLocal(bitacorasrutas): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM BITACORA_RUTAS WHERE SYNC NOT IN (0)'));
      for (let j = 0; j < bitacorasrutas.length; j++) {
        ((singleRouteLog) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO BITACORA_RUTAS ' +
            '(BRU_ID, BRU_FECHA_REGISTRO_DISPOSITIVO, BRU_USUARIO_REGISTRO, BRU_LATITUD, BRU_LONGITUD, BRU_CUADRADO, BRU_DESCRIPCION, RTA_ID, BRU_FECHA_REGISTRO) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?)',
            [singleRouteLog.BRU_ID, singleRouteLog.BRU_FECHA_REGISTRO_DISPOSITIVO, singleRouteLog.BRU_USUARIO_REGISTRO, singleRouteLog.BRU_LATITUD, singleRouteLog.BRU_LONGITUD, singleRouteLog.BRU_CUADRADO, singleRouteLog.BRU_DESCRIPCION, singleRouteLog.RTA_ID, singleRouteLog.BRU_FECHA_REGISTRO]).then(data => {
              console.log('Ruta insertada:' + JSON.stringify(singleRouteLog));
            })
          );
        })(bitacorasrutas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }

  GuardarRutasCargasLocal(rutasCargas): Promise<any> {
    const outerThis = this;
    const promise = new Promise((resolve, reject) => {
      let arregloDePromesas = [];
      arregloDePromesas.push(outerThis.database.executeSql('DELETE FROM RUTAS_CARGAS WHERE SYNC NOT IN (0)'));
      for (let j = 0; j < rutasCargas.length; j++) {
        ((singleRouteLoad) => {
          arregloDePromesas.push(outerThis.database.executeSql('INSERT INTO BITACORA_RUTAS ' +
            '(CAR_ID, RTA_ID, CAR_RTA_ESTADO) ' +
            'VALUES (?,?,?)',
            [singleRouteLoad.CAR_ID, singleRouteLoad.RTA_ID, singleRouteLoad.CAR_RTA_ESTADO]).then(data => {
              console.log('RutaCarga insertada:' + JSON.stringify(singleRouteLoad));
            })
          );
        })(rutasCargas[j]);
      }
      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });
    return promise;
  }


  GuardarParametrosLocal(parametros): Promise<any> {
    const outerThis = this;
    const promise = new Promise<boolean>(function (resolve, reject) {
      let arregloDePromesas = [];

      for (let j = 0; j < parametros.length; j++) {
        ((singleParam) => {
          const innerPromise = new Promise((resolver, rechazar) => {
            outerThis.database.executeSql('SELECT PAR_ID FROM PARAMETROS WHERE PAR_ID = ?', [singleParam.PAR_ID]).then(data => {
              if (data.rows.length > 0) {
                outerThis.database.executeSql('UPDATE PARAMETROS SET PAR_VALOR = ? WHERE PAR_ID = ?', [singleParam.PAR_VALOR, singleParam.PAR_ID]).then(data => {
                  console.log('Parametro actualizado: ' + JSON.stringify(singleParam));
                  resolver();
                }, error => {
                  rechazar();
                });
              } else {
                outerThis.database.executeSql('INSERT OR IGNORE INTO PARAMETROS (PAR_ID, PAR_CODIGO, PAR_VALOR) VALUES (?,?,?)', [singleParam.PAR_ID, singleParam.PAR_CODIGO, singleParam.PAR_VALOR]).then(data => {
                  console.log('Parametro insertado: ' + JSON.stringify(singleParam));
                  resolver();
                }, error => {
                  rechazar();
                });
              }
            });
          });
          arregloDePromesas.push(innerPromise);
        })(parametros[j]);
      }

      Promise.all(arregloDePromesas).then(allWereResolved => {
        resolve(true);
      }, anyWasRejected => {
        resolve(false);
      });
    });

    return promise;

  }

  async ObtenerUsuarioLocal(parametro): Promise<any> {
    console.log('Se ejecuta la funcion ObtenerUsuarioLocal del archivo db-elecciones.service.ts');
    const data = [parametro.USU_CLAVE, parametro.USU_NOMBRE_USUARIO, this.GetFechaHora()];
    return await this.database.executeSql('SELECT USU_ID FROM USUARIOS WHERE USU_CLAVE = ? AND USU_NOMBRE_USUARIO = ? AND USU_FECHA_REGISTRO = ?', data).then(data => {
      if (data.rows.length > 0) {
        const query1 = 'SELECT U.USU_ID,' +
          'U.USU_RUT,'
          + 'U.USU_DV,'
          + 'U.USU_NOMBRES, '
          + 'U.USU_APELLIDO_PATERNO, '
          + 'U.USU_APELLIDO_MATERNO, '
          + 'U.USU_FECHA_NACIMIENTO, '
          + 'U.USU_NOMBRE_USUARIO, '
          + 'U.USU_CLAVE, '
          + 'U.USU_FECHA_REGISTRO, '
          + 'U.USU_ESTADO, '
          + 'U.PER_ID, '
          + 'P.PER_DESCRIPCION, '
          + 'P.PER_ESTADO, '
          + 'P.PER_NOMBRE, '
          + 'P.PER_CODIGO '
          + 'FROM USUARIOS U '
          + 'JOIN PERFILES P ON P.PER_ID = U.PER_ID '
          + 'WHERE U.USU_NOMBRE_USUARIO = ? AND '
          + 'U.USU_CLAVE = ?';
        return this.database.executeSql(query1, [parametro.USU_NOMBRE_USUARIO, parametro.USU_CLAVE]).then(data => {
          let obtenerLoginUsuarioRespuesta: Object;
          let usuario: Object;
          const aplicaciones: any[] = [];
          let idPerfil = 0;

          for (let i = 0; i < data.rows.length; i++) {
            idPerfil = data.rows.item(0).PER_ID;
            usuario = {
              USU_ID: data.rows.item(0).USU_ID,
              USU_RUT: data.rows.item(0).USU_RUT,
              USU_DV: data.rows.item(0).USU_DV,
              USU_NOMBRES: data.rows.item(0).USU_NOMBRES,
              USU_APELLIDO_PATERNO: data.rows.item(0).USU_APELLIDO_PATERNO,
              USU_APELLIDO_MATERNO: data.rows.item(0).USU_APELLIDO_MATERNO,
              USU_FECHA_NACIMIENTO: data.rows.item(0).USU_FECHA_NACIMIENTO,
              USU_NOMBRE_USUARIO: data.rows.item(0).USU_NOMBRE_USUARIO,
              USU_CLAVE: data.rows.item(0).USU_CLAVE,
              USU_FECHA_REGISTRO: data.rows.item(0).USU_FECHA_REGISTRO,
              USU_ESTADO: data.rows.item(0).USU_ESTADO,
              PER_ID: data.rows.item(0).PER_ID,
              PER_DESCRIPCION: data.rows.item(0).PER_DESCRIPCION,
              PER_ESTADO: data.rows.item(0).PER_ESTADO,
              PER_NOMBRE: data.rows.item(0).PER_NOMBRE,
              PER_CODIGO: data.rows.item(0).PER_CODIGO
            };
          }

          let query2 = 'SELECT AP.APLI_ID, '
            + 'AP.APLI_CODIGO, '
            + 'AP.APLI_NOMBRE, '
            + 'AP.APLI_DESCRIPCION, '
            + 'AP.APLI_ESTADO, '
            + 'AP.APLI_IMG, '
            + 'AP.TAP_ID, '
            + 'AP.APLI_METODO, '
            + 'AP.APLI_CONTROLADOR '
            + 'FROM APLICACIONES AP '
            + 'INNER JOIN PERFILES_APLICACIONES PA ON AP.APLI_ID = PA.APLI_ID '
            + 'WHERE PA.PER_ID = ?';

          return this.database.executeSql(query2, [idPerfil]).then(data => {
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) {
                aplicaciones.push({
                  APLI_ID: data.rows.item(i).APLI_ID,
                  APLI_CODIGO: data.rows.item(i).APLI_CODIGO,
                  APLI_NOMBRE: data.rows.item(i).APLI_NOMBRE,
                  APLI_DESCRIPCION: data.rows.item(i).APLI_DESCRIPCION,
                  APLI_ESTADO: data.rows.item(i).APLI_ESTADO,
                  APLI_IMG: data.rows.item(i).APLI_IMG,
                  TAP_ID: data.rows.item(i).TAP_ID,
                  APLI_METODO: data.rows.item(i).APLI_METODO,
                  APLI_CONTROLADOR: data.rows.item(i).APLI_CONTROLADOR
                });
              }
            }
            obtenerLoginUsuarioRespuesta = {
              usuario,
              aplicaciones
            };
            return obtenerLoginUsuarioRespuesta;
          });
        });
      } else {
        const obtenerLoginUsuarioRespuesta: any = 'No existe usuario';
        return obtenerLoginUsuarioRespuesta;
      }
    });
  }

  ObtenerEstadoInicioFinDiaLocal(parametro): Promise<any> {
    console.log('Ejecuta ObtenerDiaIniciadoLocal');
    let query = 'SELECT RIN_ESTADO ' +
      ' FROM REGISTRO_INICIO_FIN_DIA ' +
      ' WHERE USU_ID = ' + parametro.USU_ID + ' AND strftime(\'%Y-%m-%d\',RIN_FECHA_INICIO) = \'' + this.GetFechaHora() + '\'';
    console.log(query);
    return this.database.executeSql(query, []).then(data => {
      let obtenerDiaIniciado: Object;
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          obtenerDiaIniciado = {
            RIN_ESTADO: data.rows.item(0).RIN_ESTADO
          };
        }
        return obtenerDiaIniciado;
      } else {
        return obtenerDiaIniciado;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  GuardarInicioFinDiaLocal(parametro): Promise<any> {
    console.log('Ejecuta GuardarInicioFinDiaLocal');
    let query = 'SELECT RIN_ESTADO' +
      ' FROM REGISTRO_INICIO_FIN_DIA ' +
      ' WHERE USU_ID = ' + parametro.USU_ID + ' AND strftime(\'%Y-%m-%d\',RIN_FECHA_INICIO) = \'' + this.GetFechaHora() + '\'';
    console.log(query);
    return this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        return this.database.executeSql('UPDATE ' +
          'REGISTRO_INICIO_FIN_DIA SET RIN_FECHA_FIN = ?,' +
          'RIN_ESTADO = 2, ' +
          'RIN_SYNC = 0 ' +
          'WHERE USU_ID = ?', [this.GetFechaHora(true), parametro.USU_ID])
          .then(data => {
            return 'Registro Actualizado';
          })
          .catch((e) =>
            console.error(e)
          );
      } else {
        return this.database.executeSql('INSERT INTO REGISTRO_INICIO_FIN_DIA '
          + '(RIN_ESTADO, '
          + 'RIN_FECHA_INICIO,'
          + 'USU_ID,'
          + 'RIN_SYNC)'
          + ' VALUES (1, ?, ?, 0)', [this.GetFechaHora(true), parametro.USU_ID])
          .then(data => {
            return 'Registro Insertado';
          })
          .catch((e) => console.log(e));
      }
    });
  }

  public async ObtenerRegistroInicioFinDiaLocal(): Promise<any> {
    console.log('Ejecuta ObtenerRegistroInicioDia');
    const query = 'SELECT RIN_ESTADO, RIN_FECHA_INICIO, RIN_FECHA_FIN, USU_ID FROM REGISTRO_INICIO_FIN_DIA WHERE RIN_SYNC = 0';
    return this.database.executeSql(query, []).then(data => {
      console.log(data);
      let registroInicioDia: Object;
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          /*if(data.rows.item(0).RIN_FECHA_FIN == null){
            data.rows.item(0).RIN_FECHA_FIN = "1900-01-01 00:00:00";
          }*/
          registroInicioDia = {
            RIN_ESTADO: data.rows.item(0).RIN_ESTADO,
            RIN_FECHA_INICIO: data.rows.item(0).RIN_FECHA_INICIO,
            RIN_FECHA_FIN: data.rows.item(0).RIN_FECHA_FIN,
            USU_ID: data.rows.item(0).USU_ID
          };
        }
        return registroInicioDia;
      } else {
        return registroInicioDia;
      }
    });
  }

  public async ActualizarRegistroInicioFinDiaLocal(): Promise<any> {
    console.log('Se actualiza RegistroInicioFinDia');
    const query = 'UPDATE REGISTRO_INICIO_FIN_DIA SET RIN_SYNC = 1';
    return this.database.executeSql(query, []).then(data => {
      console.log('Actualiza sincronizacion en REGISTRO_INICIO_FIN_DIA');
    }).catch(e => {
      console.log(e);
    });
  }

  // Obtiene todas las coordenadas que no estan sincronizadas
  async GetCoordenadasUsuarios(): Promise<any> {
    let query = 'SELECT CUS_LATITUD, CUS_LONGITUD, CUS_FECHA_DISPOSITIVO, USU_ID FROM COORDENADAS_USUARIOS WHERE CUS_SYNC = 0';
    console.log(query);
    return await this.database.executeSql(query, []).then(data => {
      console.log('En GetCoordenadasUsuarios');
      console.log(data);
      const GuardarCoordenadasUsuarioParam = {
        LISTA_COORDENADAS: []
      };
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          GuardarCoordenadasUsuarioParam.LISTA_COORDENADAS.push({
            CUS_LATITUD: data.rows.item(i).CUS_LATITUD,
            CUS_LONGITUD: data.rows.item(i).CUS_LONGITUD,
            CUS_FECHA_DISPOSITIVO: data.rows.item(i).CUS_FECHA_DISPOSITIVO,
            USU_ID: data.rows.item(i).USU_ID
          });
        }
        return GuardarCoordenadasUsuarioParam;
      } else {
        return GuardarCoordenadasUsuarioParam;
      }
    });
  }

  GetCoordenada(USU_ID: number): Promise<any> {
    let query = 'SELECT * FROM COORDENADAS_USUARIOS WHERE USU_ID = ? AND CUS_ID = (SELECT MAX(CUS_ID) FROM COORDENADAS_USUARIOS)';
    return this.database.executeSql(query, [USU_ID]).then(data => {
      const array = [];
      if (data.rows.length > 0) {
        array.push({
          CUS_LATITUD: data.rows.item(0).CUS_LATITUD,
          CUS_LONGITUD: data.rows.item(0).CUS_LONGITUD,
          CUS_FECHA_DISPOSITIVO: data.rows.item(0).CUS_FECHA_DISPOSITIVO,
          USU_ID: data.rows.item(0).USU_ID,
          CUS_SYNC: data.rows.item(0).CUS_SYNC
        });
      }
      return array;
    });
  }

  UpdateCoordenadasUsuarios(): Promise<any> {
    let query = 'UPDATE COORDENADAS_USUARIOS SET CUS_SYNC = 1';
    return this.database.executeSql(query, []);
  }

  InsertCoordenadasUsuarios(idUsuario: number, lat: number, lon: number): Promise<any> {
    let query: string = 'INSERT INTO COORDENADAS_USUARIOS(CUS_LATITUD, CUS_LONGITUD, CUS_FECHA_DISPOSITIVO, USU_ID, CUS_SYNC)'
      + ' VALUES (\'' + lat + '\',\'' + lon + '\',\'' + this.GetFechaHora(true) + '\',' + idUsuario + ',0); ';
    console.log(query);
    return this.database.executeSql(query, []);
  }

  public ObtenerParametroGps(): Promise<number> {
    let query = 'SELECT PAR_VALOR FROM PARAMETROS WHERE PAR_CODIGO = ?';

    return this.database.executeSql(query, ['INTERVALOGPS']).then(valor => {
      return valor.rows.item(0).PAR_VALOR;
    });

  }


  async obtenerTransportePorPatente(patente: string) {
    // tslint:disable-next-line: prefer-const
    let transportes: any[] = [];
    const query = 'SELECT * FROM TRANSPORTES WHERE TRA_PATENTE = ?';
    await this.database.executeSql(query, [patente]).then(data => {
      if (data.rows.length > 0) {
        transportes.push({
          TRA_ID: data.rows.item(0).TRA_ID,
          TRA_PATENTE: data.rows.item(0).TRA_PATENTE,
          TRA_NOMBRE: data.rows.item(0).TRA_NOMBRE,
          TRA_DESCRIPCION: data.rows.item(0).TRA_DESCRIPCION,
          ETR_ID: data.rows.item(0).ETR_IDC,
          REG_ID: data.rows.item(0).REG_IDC,
          TIT_ID: data.rows.item(0).TIT_IDC
        });
      }
    });
    return transportes;
  }


  async obtenerTransportes() {
    // tslint:disable-next-line: prefer-const
    let transportes: any[] = [];
    const query = 'SELECT * FROM TRANSPORTES';
    await this.database.executeSql(query, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transportes.push({
            TRA_ID: data.rows.item(i).TRA_ID,
            TRA_PATENTE: data.rows.item(i).TRA_PATENTE,
            TRA_NOMBRE: data.rows.item(i).TRA_NOMBRE,
            TRA_DESCRIPCION: data.rows.item(i).TRA_DESCRIPCION,
            ETR_ID: data.rows.item(i).ETR_IDC,
            REG_ID: data.rows.item(i).REG_IDC,
            TIT_ID: data.rows.item(i).TIT_IDC
          });

        }
      }
    });

    return transportes;
  }

  async obtenerTransportesById(id) {
    let transportes: any[] = [];
    let query = 'SELECT * FROM TRANSPORTES WHERE TRA_ID = ?';
    await this.database.executeSql(query, [id]).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transportes.push({
            TRA_ID: data.rows.item(i).TRA_ID,
            TRA_PATENTE: data.rows.item(i).TRA_PATENTE,
            TRA_NOMBRE: data.rows.item(i).TRA_NOMBRE,
            TRA_DESCRIPCION: data.rows.item(i).TRA_DESCRIPCION,
            ETR_ID: data.rows.item(i).ETR_IDC,
            REG_ID: data.rows.item(i).REG_IDC,
            TIT_ID: data.rows.item(i).TIT_IDC
          });

        }
      }
    });

    return transportes;
  }

  /**
   * Borra los registros de cualquier tabla
   * @param table Nombre le la tabla a borrar
   */
  public TruncateTable(table: string): Promise<boolean> {
    let query: string = 'DELETE FROM ' + table;
    return this.database.executeSql(query, []).then(result => {
      console.log('Registros eliminados de la tabla ' + table + ': ' + result);
      return result;
    });
  }


  async crearJsonInsertarRuta() {
    var json: any[] = [];
    await this.getAllRutasNoSync().then(async (rutas: any[]) => {
      console.log('rutas: ', rutas);
      if (rutas.length > 0) {
        for (let i = 0; i < rutas.length; i++) {
          json.push({
            RTA_ID: rutas[i].RTA_ID,
            TRA_ID: rutas[i].TRA_ID,
            USU_ID: rutas[i].USU_ID,
            ERU_ID: rutas[i].ERU_ID,
            LUG_ID_ORIGEN: rutas[i].LUG_ID_ORIGEN,
            LUG_ID_DESTINO: rutas[i].LUG_ID_DESTINO,
            RTA_LATITUD: rutas[i].RTA_LATITUD,
            RTA_LONGITUD: rutas[i].RTA_LONGITUD,
            RTA_FECHA_DISPOSITIVO: rutas[i].RTA_FECHA_DISPOSITIVO,
            LISTA_RUTAS_CARGAS: await this.obtenerRutasCargasByIdRuta(rutas[i].RTA_ID),
            LISTA_BITACORA_RUTAS: await this.armarListaBitacoraRutas(rutas[i].RTA_ID)
          });
        }
      }
    });
    return json;
  }

  async armarListaBitacoraRutas(iRuta) {
    const bitacorasRutas = [];
    await this.obtenerBitacoraRutasByIdRuta(iRuta).then((bitRut: any[]) => {
      console.log('bitacoraRutas: ', bitRut);
      if (bitRut.length > 0) {
        bitRut.forEach(async data => {
          bitacorasRutas.push({
            BRU_FECHA_REGISTRO_DISPOSITIVO: data.BRU_FECHA_REGISTRO_DISPOSITIVO,
            USU_ID: data.USU_ID,
            BRU_LATITUD: data.BRU_LATITUD,
            BRU_LONGITUD: data.BRU_LONGITUD,
            ERU_ID: data.ERU_ID,
            BRU_CUADRADO: data.BRU_CUADRADO,
            BRU_DESCRIPCION: data.BRU_DESCRIPCION,
            LISTA_BITACORA_RUTAS_CARGAS: await this.obtenerBitacorasRutasCargasByIdBitacoraRuta(data.BRU_ID),
            LISTA_BITACORA_RUTAS_IMAGENES: await this.obtenerBitacoraRutasImgByIdBitacoraRuta(data.BRU_ID),
            LISTA_BITACORA_RUTAS_CARGAS_NO_REGISTRADAS: await this.obtenerBitacoraRutasImgNoCargadaByIdBitacoraRuta(data.BRU_ID)
          });
        });
      }
    });

    return bitacorasRutas;
  }

}
