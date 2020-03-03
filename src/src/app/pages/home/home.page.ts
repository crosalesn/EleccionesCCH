import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { EleccionesService } from 'src/app/services/elecciones.service';
import { DbEleccionesService } from '../../services/db-elecciones.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public usuario: any;
  public isLogged = false;
  public diaIniciado = '';

  constructor(private eleccionesService: EleccionesService, private renderer: Renderer2, 
    private dbElecciones: DbEleccionesService, private funciones: FuncionesService) { }

  ngOnInit() {
    var usuarioConectado : boolean =  this.funciones.getNetworkStatus();
	  this.usuario = this.funciones.GetUsuarioLogeado();
    console.log(this.usuario)
    let parametro = {
      USU_ID: this.usuario.usuario.USU_ID
    }
    if(this.usuario.usuario.PER_NOMBRE === 'OPERADOR')
    {
      if(!usuarioConectado){
        console.log("Entrando a home sin conexion");
        this.dbElecciones.ObtenerEstadoInicioFinDiaLocal(parametro).then(data => {
          if(data == null){
            console.log("No ha comenzado el dia")
            this.diaIniciado = 'INICIAR DÍA';
          }else if(data.RIN_ESTADO == 1){
            var elements = document.querySelectorAll('.dia');
                for(var i = 0; i < elements.length; i++)
                {
                  this.renderer.removeClass(elements[i], 'inactivo');
                  this.renderer.removeClass(elements[i], 'disabled');
                }
              this.diaIniciado = 'FINALIZAR DÍA';
          }else{
            this.diaIniciado = 'ACTIVIDADES TERMINADAS';
          }
        });
      }else{
       
        this.eleccionesService.ObtenerEstadoInicioFinDia(parametro)
          .subscribe(
          (info) => {
            if(info.RIN_ESTADO == 0){
              this.diaIniciado = 'INICIAR DÍA';
              this.dbElecciones.BorraRegistroInicioFinDiaLocal();
            }else if(info === null){
              this.diaIniciado = '';
            }else if(info.RIN_ESTADO == 1){
                var elements = document.querySelectorAll('.dia');
                for(var i = 0; i < elements.length; i++)
                {
                  this.renderer.removeClass(elements[i], 'inactivo');
                  this.renderer.removeClass(elements[i], 'disabled');
                }
              this.diaIniciado = 'FINALIZAR DÍA';
            }else{
              this.diaIniciado = 'ACTIVIDADES TERMINADAS';
            }
        });
      }
      
    }
  }

  ClickIniciarDia(event)
  {
    var usuarioConectado : boolean =  this.funciones.getNetworkStatus();
    if(!usuarioConectado){
      if(this.diaIniciado == 'INICIAR DÍA'){
        let parametro = {
          USU_ID : this.usuario.usuario.USU_ID
        }
        this.dbElecciones.GuardarInicioFinDiaLocal(parametro).then(data => {
          if(data === "Registro Insertado"){
            var elements = document.querySelectorAll('.dia');
            for(var i = 0; i < elements.length; i++)
            {				   
              this.renderer.removeClass(elements[i], 'inactivo');
              this.renderer.removeClass(elements[i], 'disabled');
            }
            this.funciones.msn("Dia iniciado correctamente");
            this.diaIniciado = 'FINALIZAR DÍA';
          }
        });
      }else if(this.diaIniciado == 'FINALIZAR DÍA'){
        let parametro = {
          USU_ID : this.usuario.usuario.USU_ID
        }
        this.dbElecciones.GuardarInicioFinDiaLocal(parametro).then(data => {
          if(data === "Registro Actualizado"){
            this.funciones.msn("Dia finalizado correctamente");
            this.diaIniciado = 'ACTIVIDADES TERMINADAS';
            var elements = document.querySelectorAll('.dia');

            for(var i = 0; i < elements.length; i++)
            {
              if(elements[i].nodeName==="A")
              {
                this.renderer.addClass(elements[i], 'inactivo');
                this.renderer.addClass(elements[i], 'disabled');
              }
            }
          }
        });
      } if(this.diaIniciado == 'ACTIVIDADES TERMINADAS'){
        
      }else{
        this.diaIniciado = 'INICIANDO...';
      }
    }else{
      if(this.diaIniciado == 'INICIAR DÍA'){
        let parametro = {
          USU_ID : this.usuario.usuario.USU_ID
        }
        this.eleccionesService.GuardarInicioFinDiaOnline(parametro)
          .subscribe(
            (info) => {
              if(info.error.codigo == 1){
                this.funciones.msn("Dia no iniciado correctamente");
              }else{
                var elements = document.querySelectorAll('.dia');
                for(var i = 0; i < elements.length; i++)
                {
                  this.renderer.removeClass(elements[i], 'inactivo');
                  this.renderer.removeClass(elements[i], 'disabled');
                }
                this.funciones.msn("Dia iniciado correctamente");
                this.diaIniciado = 'FINALIZAR DÍA';
                this.dbElecciones.GuardarInicioFinDiaLocal(this.usuario.usuario).then(data => {
                  console.log(data);
                });
              }
            });
      }else if(this.diaIniciado == 'FINALIZAR DÍA'){
        let parametro = {
          USU_ID : this.usuario.usuario.USU_ID
        }
        this.eleccionesService.GuardarInicioFinDiaOnline(parametro)
          .subscribe(
            (info) => {
              if(info.error.codigo == 1){
                this.funciones.msn("Dia no finalizado correctamente");
              }else{
                this.funciones.msn("Dia finalizado correctamente");
                this.diaIniciado = 'ACTIVIDADES TERMINADAS';
                var elements = document.querySelectorAll('.dia');
                for(var i = 0; i < elements.length; i++)
                {
                  if(elements[i].nodeName==="A")
                  {
                    this.renderer.addClass(elements[i], 'inactivo');
                    this.renderer.addClass(elements[i], 'disabled');
                  }
                }
                this.dbElecciones.GuardarInicioFinDiaLocal(this.usuario.usuario).then(data => {
                  console.log(data);
                });
              }
            });
      }else if(this.diaIniciado == 'ACTIVIDADES TERMINADAS'){
        
      }else{
        this.diaIniciado = 'INICIANDO...';
      }
    }
  }

  onLogout(): void {
    this.funciones.onLogout();
  }

}
