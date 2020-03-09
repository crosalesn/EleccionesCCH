import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IRuta } from '../interfaces/ruta.interface';
@Injectable({
  providedIn: 'root'
})
export class RutaService {
  rutas: IRuta[] = [];

  constructor(private storage: Storage) {
    this.obtenerRutas();
    //this.deleteAll();
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
