import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { EleccionesService } from './services/elecciones.service';
import { DbEleccionesService } from './services/db-elecciones.service';
import { FuncionesService } from './services/funciones.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DbSincroService } from './services/db-sincro.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private eleccionesService: EleccionesService,
    private funcionesService: FuncionesService,
    private dbElecciones: DbEleccionesService,
    private dbSincro: DbSincroService,
    private sqlite: SQLite
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("inicia app.component");
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.crearBD();
    });    
  }

  private crearBD(){
    this.sqlite.create({
      name: 'elecciones.db',
      location: 'default'
    })
    .then((db) => {
      console.log("Setea e importa la bd")
      this.dbElecciones.setDatabase(db);
      this.dbSincro.setDatabase(db);
      return this.dbElecciones.ImportacionDB();
    })
    .catch(error =>{
      console.error(error);
    });
  }
}
