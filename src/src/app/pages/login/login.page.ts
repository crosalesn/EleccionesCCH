import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { EleccionesService } from '../../services/elecciones.service';
import { DbEleccionesService } from '../../services/db-elecciones.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  datosFormulario: any;
  loginForm: FormGroup;
  usuarioLocal: any;

  constructor(private eleccionesService: EleccionesService, private router: 
    Router, private builder: FormBuilder, private dbElecciones: DbEleccionesService, 
    private funciones: FuncionesService) {
      this.loginForm = this.builder.group({
        usuario: [''],
        clave: ['']
       });
    }

  ngOnInit() { 

  }
  
  caracteresPermitidos(event: any){
    let tecla = (document.all) ? event.keyCode : event.which;
    if (tecla == 8) {
      return true;
    }
    let patron = /[0-9-A-Za-zñÑ-áéíóúÁÉÍÓÚ\s\t-]/;
    let tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
  }

  Ingresar(camposFormulario){
  this.datosFormulario = {USU_NOMBRE_USUARIO: camposFormulario.usuario, USU_CLAVE: camposFormulario.clave};																	 
    
	if(!camposFormulario.usuario.trim()){
        this.funciones.msn("Usuario no ingresado");
        return;
    }

    if(!camposFormulario.clave.trim()){
      this.funciones.msn("Contraseña no ingresada");
      return;
    }

    var usuarioConectado : boolean =  this.funciones.getNetworkStatus();

    if(!usuarioConectado){
      this.dbElecciones.ObtenerUsuarioLocal(this.datosFormulario).then(data => {
        this.usuarioLocal = data;
        if(this.usuarioLocal === "No existe usuario"){
          this.funciones.msn("Debe estar conectado a la red para acceder por primera vez",1);
        }else{
          this.funciones.SetUsuarioLogeado(this.usuarioLocal);
          const token = this.usuarioLocal.usuario.USU_ID;
          this.funciones.SetToken(token);                      
          this.router.navigateByUrl('/home');
        }
      });
    }else{

      var GpsConectado : boolean =  this.funciones.GpsValidar();

      if(!GpsConectado){
        console.log("Debe activar el GPS");
      }

      this.eleccionesService.ObtenerLoginUsuario(this.datosFormulario)
        .subscribe(
          (info)=>{
            if(info.error === null){
              this.funciones.SetUsuarioLogeado(info);
              this.dbElecciones.BorrarPerfilesLocal();
              this.dbElecciones.BorrarUsuarioLocal();
              this.dbElecciones.BorrarAplicacionesLocal();
		      this.dbElecciones.BorrarParametrosLocal();										
              this.dbElecciones.BorrarPerfilesAplicacionesLocal();
              this.dbElecciones.AgregarUsuarioLocal(info);
              const token = info.usuario.USU_ID;
              this.funciones.SetToken(token);                       
              this.router.navigateByUrl('/sincronizar');
            }else {
              switch(info.error !== null) { 
                case info.error.codigo == 1: { 
                  this.funciones.msn(info.error.mensaje);
                  break; 
                } 
                case info.error.codigo == 2: { 
                  this.funciones.msn(info.error.mensaje);
                  break; 
                } 
                default: { 
                  this.funciones.msn("Datos incorrectos");
                  break;
                } 
            }
          }
        },
        error => {
          this.funciones.msn("Error de conexion al servidor - Intente reconectar el wifi");
      });
    }
  }
}
