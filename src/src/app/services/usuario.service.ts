import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioLogeado: any;

  constructor() {
    this.usuarioLogeado = this.obtenerUsuario();
  }

  obtenerUsuario() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
  }


  crearRuta() {

  }
}
