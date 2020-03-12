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
    Router, private builder: FormBuilder, private dbElecciones: DbEleccionesService,
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
    let tecla = (document.all) ? event.keyCode : event.which;
    if (tecla == 8) {
      return true;
    }
    let patron = /[0-9-A-Za-zñÑ-áéíóúÁÉÍÓÚ\s\t-]/;
    let tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
  }

  Ingresar(camposFormulario) {
    this.datosFormulario = { USU_NOMBRE_USUARIO: camposFormulario.usuario, USU_CLAVE: camposFormulario.clave };

    if (!camposFormulario.usuario.trim()) {
      this.alertas.Alerta("Usuario no ingresado");
      return;
    }

    if (!camposFormulario.clave.trim()) {
      this.alertas.Alerta("Contraseña no ingresada");
      return;
    }

    this.net.checkNetworkStatusNow().then(usuarioConectado => {
      if (!usuarioConectado) {
        this.dbElecciones.ObtenerUsuarioLocal(this.datosFormulario).then(data => {
          this.usuarioLocal = data;
          if (this.usuarioLocal === "No existe usuario") {
            this.alertas.Alerta("Debe estar conectado a la red para acceder por primera vez");
          } else {
            this.funciones.SetUsuarioLogeado(this.usuarioLocal);
            const token = this.usuarioLocal.usuario.USU_ID;
            this.funciones.SetToken(token);
            this.router.navigateByUrl('/home');
          }
        });
      } else {

        this.eleccionesService.ObtenerLoginUsuario(this.datosFormulario)
          .subscribe(
            (info) => {
              if (info.error === null) {
                this.funciones.SetUsuarioLogeado(info);
                this.dbElecciones.BorrarPerfilesLocal();
                this.dbElecciones.BorrarUsuarioLocal();
                this.dbElecciones.BorrarAplicacionesLocal();
                this.dbElecciones.BorrarParametrosLocal();
                this.dbElecciones.BorrarPerfilesAplicacionesLocal();
                this.dbElecciones.AgregarUsuarioLocal(info);
                const token = info.usuario.USU_ID;
                this.funciones.SetToken(token);
                this.sincronizar.Sincronizar().then(sincronizacionFueExitosa => {
                  if (sincronizacionFueExitosa) {
                    this.router.navigateByUrl('/home');
                    return;
                  }
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
                    this.alertas.Alerta("Datos incorrectos");
                    break;
                  }
                }
              }
            },
            error => {
              this.alertas.Alerta("Error de conexion al servidor - Intente reconectar el wifi");
            });
      }
    });
  }
}
