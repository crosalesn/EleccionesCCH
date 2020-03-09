import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioLogeado: any;

  constructor(private storage: Storage) {
    this.usuarioLogeado = this.obtenerUsuario();
  }

  obtenerUsuario() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
  }

}
