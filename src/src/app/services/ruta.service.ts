import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IRuta } from '../interfaces/ruta.interface';
import { DbEleccionesService } from './db-elecciones.service';
@Injectable({
  providedIn: 'root'
})
export class RutaService {
  rutas: IRuta[] = [];
  ruta: any;
  constructor(
    private storage: Storage,
    private db: DbEleccionesService
  ) 
  {        
    this.obtenerRutas();
    //this.deleteAll();
  }

  setRuta(ruta) {
    this.ruta = ruta;
  }
 
  getRuta() {
    return this.ruta;
  }

  insertarRutas(ruta){
    this.rutas.push(ruta);
    this.storage.set("misRutas", this.rutas);  
  }

  async obtenerRutas(){  
    const rutas = await this.storage.get("misRutas");
    if (rutas) {
      this.rutas = rutas;
    }    
  }

  async deleteAll() {
    await this.storage.remove("misRutas");
  }
}
