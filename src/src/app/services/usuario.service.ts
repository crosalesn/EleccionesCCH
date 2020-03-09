import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioLogeado: any;
  
  constructor() { }

  obtenerUsuario() {
    return JSON.parse(localStorage.getItem("usuarioActual"));
  } 


  crearRuta() {
    
  }
}
