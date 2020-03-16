import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbEleccionesService } from '../../services/db-elecciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RutaService } from 'src/app/services/ruta.service';
import { IRuta } from 'src/app/interfaces/ruta.interface';


@Component({
  selector: 'app-mis-rutas',
  templateUrl: './mis-rutas.page.html',
  styleUrls: ['./mis-rutas.page.scss'],
})
export class MisRutasPage implements OnInit {
  ruta: any;

  rutas = [];

  usuario: any;
  constructor(
    private route: Router,
    private dbElecciones: DbEleccionesService,
    private user: UsuarioService,
    private rutaServ: RutaService
  ) {
      this.usuario = user.obtenerUsuario();
      console.log('usuarioLogeado: ', this.usuario);      
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.dbElecciones.crearJsonInsertarRuta().then(data => {
      console.log('jsonIngresar :', data);
    });
    this.dbElecciones.obtenerRutas().then( rutas => {
      console.log('todas las Rutas Inicio: ', rutas);
      this.rutas = rutas;
    });
    
  } 

  crearRuta() {
    this.route.navigate(['/mis-rutas/crear-ruta']);
  }

  detalleRuta(estadoRuta: number, ruta: IRuta) {    
    if( estadoRuta == 2 ) {
      this.rutaServ.setRuta(ruta);
      this.route.navigate(['/rutas-detalle']);
    }    
  }
}



