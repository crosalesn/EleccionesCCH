import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbSincroService {
  private database: SQLiteObject = null;

  constructor() { }

  setDatabase(database: SQLiteObject){
    if(this.database === null){
      this.database = database;
    }
  }

  ObtenerRutasNoSincronizadas(): Promise<any> {
    return this.database.executeSql("SELECT * FROM RUTAS WHERE RTA_SYNC = 0", []);
  }

  UpdateRutasSincronizadas(): Promise<any> {
    return this.database.executeSql("UPDATE RUTAS SET RTA_SYNC = 1", []);
  }

}
