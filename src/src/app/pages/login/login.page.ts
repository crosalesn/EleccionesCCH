import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { EleccionesService } from '../../services/elecciones.service';
import { DbEleccionesService } from '../../services/db-elecciones.service';
import { NetworkService } from '../../services/network.service';
import { AlertasService } from '../../services/alertas.service';
import { FuncionesService } from '../../services/funciones.service';
import { SincronizarService } from '../../services/sincronizar.service';

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
    Router,   private builder: FormBuilder, private dbElecciones: DbEleccionesService,
              private net: NetworkService,
              private alertas: AlertasService,
              private funciones: FuncionesService,
              private sincronizar: SincronizarService) {
    this.loginForm = this.builder.group({
      usuario: [''],
      clave: ['']
    });
  }

  ngOnInit() {    
  }

  caracteresPermitidos(event: any) {
    const tecla = (document.all) ? event.keyCode : event.which;
    if (tecla == 8) {
      return true;
    }
    const patron = /[0-9-A-Za-zñÑ-áéíóúÁÉÍÓÚ\s\t-]/;
    // tslint:disable-next-line: variable-name
    let tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
  }

  async Ingresar(camposFormulario) {
    this.datosFormulario = { USU_NOMBRE_USUARIO: camposFormulario.usuario, USU_CLAVE: camposFormulario.clave };

    if (!camposFormulario.usuario.trim()) {
      this.alertas.Alerta('Usuario no ingresado');
      return;
    }

    if (!camposFormulario.clave.trim()) {
      this.alertas.Alerta('Contraseña no ingresada');
      return;
    }

    await this.net.checkNetworkStatusNow().then(usuarioConectado => {
      console.log('usuarioConectado :', usuarioConectado);
      if (!usuarioConectado) {
        console.log('aqui !usuarioConectado');
        this.dbElecciones.ObtenerUsuarioLocal(this.datosFormulario).then(data => {
          this.usuarioLocal = data;
          if (this.usuarioLocal === 'No existe usuario') {
            this.alertas.Alerta('Debe estar conectado a la red para acceder por primera vez');
          } else {
            this.funciones.SetUsuarioLogeado(this.usuarioLocal);
            const token = this.usuarioLocal.usuario.USU_ID;
            this.funciones.SetToken(token);
            this.router.navigateByUrl('/home');
          }
        });
      } else {
        console.log('aqui else Ingresar');
        this.eleccionesService.ObtenerLoginUsuario(this.datosFormulario)
          .subscribe(
            (info) => {
              console.log('info: ', info);
              if (info.error === null) {
                console.log('info no error: ', info);
                this.funciones.SetUsuarioLogeado(info);
                console.log('this.funciones.SetUsuarioLogeado(info);');
                this.dbElecciones.BorrarPerfilesLocal();
                console.log('BorrarPerfilesLocal');
                this.dbElecciones.BorrarUsuarioLocal();
                console.log('BorrarUsuarioLocal');
                this.dbElecciones.BorrarAplicacionesLocal();
                console.log('BorrarAplicacionesLocal');
                this.dbElecciones.BorrarParametrosLocal();
                console.log('BorrarParametrosLocal');

                // this.dbElecciones.Borrar('CARGAS');

                // this.dbElecciones.Borrar('RUTAS_CARGAS');
                
                // this.dbElecciones.Borrar('BITACORA_RUTAS');
                this.dbElecciones.borrarBitacorasRutasSync();

                this.dbElecciones.Borrar('ESTADOS_RUTAS');

                this.dbElecciones.Borrar('TRANSPORTES');

                this.dbElecciones.Borrar('EMPRESAS_TRANSPORTES');

                this.dbElecciones.Borrar('LUGARES');

                this.dbElecciones.Borrar('TIPO_LUGARES');
                
                this.dbElecciones.borrarBitacorasRutasCargasSync();

                this.dbElecciones.BorrarPerfilesAplicacionesLocal();

                this.dbElecciones.AgregarUsuarioLocal(info);
                const token = info.usuario.USU_ID;
                this.funciones.SetToken(token);
                console.log('aquiiiiiiiiiiiii');
                this.sincronizar.Sincronizar().then(sincronizacionFueExitosa => {
                  console.log('sincronizacionFueExitosa :', sincronizacionFueExitosa);
                  if (sincronizacionFueExitosa) {
                    this.router.navigate(['/home']);
                    return;
                  } else {
                    this.alertas.Alerta('Error al sincronizar');
                  }
                }).catch(error => {
                  console.log('error al sincronizar');
                });

              } else {
                switch (info.error !== null) {
                  case info.error.codigo == 1: {
                    this.alertas.Alerta(info.error.mensaje);
                    break;
                  }
                  case info.error.codigo == 2: {
                    this.alertas.Alerta(info.error.mensaje);
                    break;
                  }
                  default: {
                    this.alertas.Alerta('Datos incorrectos');
                    break;
                  }
                }
              }
            },
            error => {
              this.alertas.Alerta('Error de conexion al servidor - Intente reconectar el wifi');
            });
      }
    });
  }
}
