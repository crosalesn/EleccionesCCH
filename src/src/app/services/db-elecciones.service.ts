import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbEleccionesService {

  private database: SQLiteObject = null;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, 
    private http: HttpClient) {
    console.log("Se llama constructor de Db-Elecciones");

   }

   /**
   * Obtiene la fecha y hora del movil
   * @param horas (Opcional) Si es TRUE devuelve la fecha y hora de lo contrario solo devuelve solo la fecha
   */
  GetFechaHora(horas?: boolean): string{

    var date: any = new Date();
    var day: any = date.getDate();       // yields date
    var month: any = date.getMonth() + 1; // yields month (add one as '.getMonth()' is zero indexed)
    var year: any = date.getFullYear();  // yields year
    var hour: any = date.getHours();     // yields hours 
    var minute: any = date.getMinutes(); // yields minutes
    var second: any = date.getSeconds(); // yields seconds
    
    if(day < 10){
      day = "0"+day;
    }

    if(month < 10){
      month = "0"+month;
    }

    if(hour < 10) {
      hour = "0"+hour;
    }
    if(minute < 10) {
      minute = "0"+minute;
    }
    if(second < 10) {
      second = "0"+second;
    }

    var fecha: string = year + "-" + month + "-" + day;
    var fechayhora: string = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    
    return (horas)? fechayhora: fecha;
  }

   setDatabase(database: SQLiteObject){
    if(this.database === null){
      this.database = database;
    }
  }


   ImportacionDB(){
    console.log("Intentando obtener elecciones.sql");
    this.http.get('../../assets/bd/elecciones.sql', { responseType: 'text'})
    .subscribe(sql => {
      console.log("Se obtuvo elecciones.sql");
      console.log(this.database);
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          console.log("la importacion se realizó correctamente");
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }


  GetDatabaseState(){
    return this.dbReady.asObservable();
  }
  BorrarUsuarioLocal(){
    return this.database.executeSql('DELETE FROM USUARIOS', []).then(data =>{
      console.log("Usuarios borrado");
    });
  }

  BorrarParametrosLocal(){
    return this.database.executeSql('DELETE FROM PARAMETROS', []).then(data =>{
      console.log("Parametros borrados");
    });
  }

  BorrarPerfilesLocal(){
    return this.database.executeSql('DELETE FROM PERFILES', []).then(data =>{
      console.log("Perfiles borrado");
    });
  }

  BorraRegistroInicioFinDiaLocal(){
    return this.database.executeSql('DELETE FROM REGISTRO_INICIO_FIN_DIA', []).then(data =>{
      console.log("REGISTRO_INICIO_FIN_DIA borrado");
    });
  }

  BorrarAplicacionesLocal(){
    return this.database.executeSql('DELETE FROM APLICACIONES', []).then(data =>{
      console.log("Aplicaciones borrado");
    });
  }

  BorrarPerfilesAplicacionesLocal(){
    return this.database.executeSql('DELETE FROM PERFILES_APLICACIONES', []).then(data =>{
      console.log("Perfiles_Aplicaciones borrado");
    });
  }


  AgregarUsuarioLocal(parametro) {
    console.log("Se ejecuta la funcion AgregarUsuarioLocal del archivo db-elecciones.service.ts");
    let data = [parametro.usuario.USU_CLAVE, parametro.usuario.USU_NOMBRE_USUARIO];
    return this.database.executeSql('SELECT USU_ID FROM USUARIOS WHERE USU_CLAVE = ? AND USU_NOMBRE_USUARIO = ?', data).then(data => {
      if(data.rows.length > 0){
        console.log("Usuario ya existe")
      }
      else
      {
        let USU_FECHA_REGISTRO = this.GetFechaHora();
        let usuario = [
          parseInt(parametro.usuario.USU_ID), 
          parseInt(parametro.usuario.USU_RUT),
          parametro.usuario.USU_DV,
          parametro.usuario.USU_NOMBRES,
          parametro.usuario.USU_APELLIDO_PATERNO,
          parametro.usuario.USU_APELLIDO_MATERNO,
          parametro.usuario.USU_FECHA_NACIMIENTO,
          parametro.usuario.USU_NOMBRE_USUARIO,
          parametro.usuario.USU_CLAVE,
          USU_FECHA_REGISTRO,
          parseInt(parametro.usuario.USU_ESTADO),
          parseInt(parametro.usuario.PER_ID)
        ];

        let perfil = [
          parseInt(parametro.usuario.PER_ID),
          parametro.usuario.PER_CODIGO,
          parametro.usuario.PER_NOMBRE,
          parametro.usuario.PER_DESCRIPCION,
          parametro.usuario.PER_ESTADO
        ];
        
        return this.database.executeSql('INSERT INTO PERFILES '
          +'(PER_ID,'
          + 'PER_CODIGO,'
          + 'PER_NOMBRE,'
          + 'PER_DESCRIPCION,'
          + 'PER_ESTADO) ' 
          + 'VALUES (?, ?, ?, ?, ?)',
          perfil).then(data =>{
            console.log("Perfil guardado")
            return this.database.executeSql('INSERT INTO USUARIOS '
            +'(USU_ID, '
            +'USU_RUT, ' 
            +'USU_DV, '
            +'USU_NOMBRES,'
            +'USU_APELLIDO_PATERNO, '
            +'USU_APELLIDO_MATERNO, '
            +'USU_FECHA_NACIMIENTO, '
            +'USU_NOMBRE_USUARIO,' 
            +'USU_CLAVE, '
            +'USU_FECHA_REGISTRO, '
            +'USU_ESTADO, PER_ID) '
            +'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            usuario).then(data => {
              console.log("Usuario guardado")
              for(var i = 0; i < parametro.aplicaciones.length; i++)
                      {
                        ((param) => {
                          let tempAplicaciones = [
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
                            console.log("Aplicacion guardada");
                            console.log(tempAplicaciones)
                                this.database.executeSql('INSERT INTO PERFILES_APLICACIONES ('
                                +'PER_ID,'  
                                +'APLI_ID)'
                                +' VALUES '
                                +'(?, ?)',
                                [parametro.usuario.PER_ID, param.APLI_ID]).then(data =>{
                                  console.log(parametro.usuario.PER_ID);
                                  console.log(param.APLI_ID);
                                  console.log("Perfiles_Aplicaciones guardados");
                                });
                          });
                        
                        }) (parametro.aplicaciones[i])
                      }
                });
          });
      }
    });
  }

  GuardarParametrosLocal(parametro): Promise<any> {
    return this.database.executeSql('SELECT PAR_ID FROM PARAMETROS WHERE PAR_ID = ?', [parametro.PAR_ID]).then(data => {
      if(data.rows.length > 0){
        return this.database.executeSql('UPDATE PARAMETROS '
        +'SET PAR_VALOR = ? WHERE PAR_ID = ?', [parametro.PAR_VALOR, parametro.PAR_ID]).then(data => {
          console.log("Parametro actualizado");
        });
      }else{
        return this.database.executeSql('INSERT OR IGNORE INTO PARAMETROS (PAR_ID ,'
        +'PAR_VALOR) VALUES (?, ?)', [parametro.PAR_ID, parametro.PAR_VALOR]).then(data => {
          console.log("Parametro GPS insertado");
        });
      }
    });
    
  }

  ObtenerUsuarioLocal(parametro): Promise<any> {
    console.log("Se ejecuta la funcion ObtenerUsuarioLocal del archivo db-elecciones.service.ts");
    let data = [parametro.USU_CLAVE, parametro.USU_NOMBRE_USUARIO, this.GetFechaHora()];
    return this.database.executeSql('SELECT USU_ID FROM USUARIOS WHERE USU_CLAVE = ? AND USU_NOMBRE_USUARIO = ? AND USU_FECHA_REGISTRO = ?', data).then(data => {
      if(data.rows.length > 0){
      let query1 = 'SELECT U.USU_ID,'+ 
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
      let aplicaciones: any[] = [];
      let idPerfil: number = 0;
								 
        for (var i = 0; i < data.rows.length; i++) {
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
            }
        }

        let query2 = 'SELECT AP.APLI_ID, '
          +'AP.APLI_CODIGO, ' 
          +'AP.APLI_NOMBRE, '
          +'AP.APLI_DESCRIPCION, ' 
          +'AP.APLI_ESTADO, '
          +'AP.APLI_IMG, '
          +'AP.TAP_ID, '
          +'AP.APLI_METODO, '
          +'AP.APLI_CONTROLADOR '
          +'FROM APLICACIONES AP '
          +'INNER JOIN PERFILES_APLICACIONES PA ON AP.APLI_ID = PA.APLI_ID '
          +'WHERE PA.PER_ID = ?';    

        return this.database.executeSql(query2, [idPerfil]).then(data => {
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
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
              usuario: usuario,
              aplicaciones: aplicaciones
            }
            return obtenerLoginUsuarioRespuesta;
            });
        });
      }
      else
      {
        let obtenerLoginUsuarioRespuesta: any = "No existe usuario";
        return obtenerLoginUsuarioRespuesta;
      }
    });
  }

  ObtenerEstadoInicioFinDiaLocal(parametro): Promise<any>{
    console.log("Ejecuta ObtenerDiaIniciadoLocal");
    var query = "SELECT RIN_ESTADO " +
    " FROM REGISTRO_INICIO_FIN_DIA " +
    " WHERE USU_ID = " + parametro.USU_ID + " AND strftime('%Y-%m-%d',RIN_FECHA_INICIO) = '"+ this.GetFechaHora() + "'";
    console.log(query);
    return this.database.executeSql(query, []).then(data => {
      let obtenerDiaIniciado: Object;
      if(data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          obtenerDiaIniciado = {				 
            RIN_ESTADO: data.rows.item(0).RIN_ESTADO
            }
        }
        return obtenerDiaIniciado;
      }else{
        return obtenerDiaIniciado;
      }
    }).catch(error => { console.log(error)
    });
  }

  GuardarInicioFinDiaLocal(parametro): Promise<any>{
    console.log("Ejecuta GuardarInicioFinDiaLocal");
    var query = "SELECT RIN_ESTADO" +
    " FROM REGISTRO_INICIO_FIN_DIA " +
    " WHERE USU_ID = " + parametro.USU_ID + " AND strftime('%Y-%m-%d',RIN_FECHA_INICIO) = '"+ this.GetFechaHora() + "'";
    console.log(query);
    return this.database.executeSql(query, []).then(data => {
      if(data.rows.length > 0){
        return this.database.executeSql('UPDATE '+
        'REGISTRO_INICIO_FIN_DIA SET RIN_FECHA_FIN = ?,'+
        'RIN_ESTADO = 2, '+
        'RIN_SYNC = 0 '+ 
        'WHERE USU_ID = ?', [this.GetFechaHora(true), parametro.USU_ID])
        .then(data => {
          return "Registro Actualizado";
        })
        .catch((e) => 
        console.error(e)
        );
      }else{
        return this.database.executeSql('INSERT INTO REGISTRO_INICIO_FIN_DIA '
        +'(RIN_ESTADO, '
        +'RIN_FECHA_INICIO,'
        +'USU_ID,' 
        +'RIN_SYNC)'
        +' VALUES (1, ?, ?, 0)', [this.GetFechaHora(true), parametro.USU_ID])
        .then(data => {
          return "Registro Insertado";
        })
        .catch((e) => console.log(e));
        }
    });
  }

  public async ObtenerRegistroInicioFinDiaLocal(): Promise<any>{
    console.log("Ejecuta ObtenerRegistroInicioDia");
    let query = "SELECT RIN_ESTADO, RIN_FECHA_INICIO, RIN_FECHA_FIN, USU_ID FROM REGISTRO_INICIO_FIN_DIA WHERE RIN_SYNC = 0";
    return this.database.executeSql(query, []).then(data => {
      console.log(data);
      let registroInicioDia: Object;
      if(data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          /*if(data.rows.item(0).RIN_FECHA_FIN == null){
            data.rows.item(0).RIN_FECHA_FIN = "1900-01-01 00:00:00";
          }*/
          registroInicioDia = {
            RIN_ESTADO: data.rows.item(0).RIN_ESTADO,
            RIN_FECHA_INICIO: data.rows.item(0).RIN_FECHA_INICIO,
            RIN_FECHA_FIN: data.rows.item(0).RIN_FECHA_FIN,
            USU_ID: data.rows.item(0).USU_ID
          }
        }
        return registroInicioDia;
      }
      else{
        return registroInicioDia;
      }
    });
  }

  public async ActualizarRegistroInicioFinDiaLocal(): Promise<any>{
    console.log("Se actualiza RegistroInicioFinDia");
    let query = "UPDATE REGISTRO_INICIO_FIN_DIA SET RIN_SYNC = 1";
    return this.database.executeSql(query, []).then(data => {
      console.log("Actualiza sincronizacion en REGISTRO_INICIO_FIN_DIA");
    });
  }


  //Obtiene todas las coordenadas que no estan sincronizadas
  GetCoordenadasUsuarios(): Promise<any>{
    var query: string = "SELECT CUS_LATITUD, CUS_LONGITUD, CUS_FECHA_DISPOSITIVO, USU_ID FROM COORDENADAS_USUARIOS WHERE CUS_SYNC = 0";
    console.log(query);
    return this.database.executeSql(query,[]).then(data =>{
      console.log("En GetCoordenadasUsuarios")
      console.log(data);
      let GuardarCoordenadasUsuarioParam =  {
        LISTA_COORDENADAS: []
      };
      if(data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
  
          GuardarCoordenadasUsuarioParam.LISTA_COORDENADAS.push({
              CUS_LATITUD: data.rows.item(i).CUS_LATITUD,
              CUS_LONGITUD: data.rows.item(i).CUS_LONGITUD,
              CUS_FECHA_DISPOSITIVO: data.rows.item(i).CUS_FECHA_DISPOSITIVO,
              USU_ID: data.rows.item(i).USU_ID
          });
        }
         return GuardarCoordenadasUsuarioParam;
      }else{
        return GuardarCoordenadasUsuarioParam;
      }
    });
  }

  UpdateCoordenadasUsuarios(): Promise<any>{
    var query: string = "UPDATE COORDENADAS_USUARIOS SET CUS_SYNC = 1";
    return this.database.executeSql(query,[]);
  }

  InsertCoordenadasUsuarios(idUsuario:number, lat:number, lon:number): Promise<any>{
    debugger
    var query: string = "INSERT INTO COORDENADAS_USUARIOS(CUS_LATITUD, CUS_LONGITUD, CUS_FECHA_DISPOSITIVO, USU_ID, CUS_SYNC)"
                        +" VALUES ('"+lat+"','"+lon+"','"+this.GetFechaHora(true)+"',"+idUsuario+",0); ";
    console.log(query);
    return this.database.executeSql(query,[]);
  }

  public ObtenerParametroGps(): Promise<number>{
    var query = "SELECT PAR_VALOR FROM PARAMETROS WHERE PAR_ID = ?";

    return this.database.executeSql(query, [2]).then(valor =>{
      return valor.rows.item(0).PAR_VALOR;
    });

  }

  /**
   * Borra los registros de cualquier tabla
   * @param table Nombre le la tabla a borrar
   */
  public TruncateTable(table:string): Promise<boolean>{
    var query: string = "DELETE FROM "+table;
    return this.database.executeSql(query,[]).then(result =>{
      console.log("Registros eliminados de la tabla "+table+": "+result);
      return result;
    });
  }

}