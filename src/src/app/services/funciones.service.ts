import { Injectable } from '@angular/core';
import { isNullOrUndefined } from "util";
import { ToastController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { EleccionesService } from './elecciones.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private online: Observable<boolean> = null;

  constructor(public toast: ToastController, 
    public alert: AlertController, private activatedRoute: ActivatedRoute, private router:Router, 
    private eleccionesService: EleccionesService, private http: HttpClient) { 

  }

  /**
   * Obtiene la fecha y hora del movil
   * @param horas (Opcional) Si es TRUE devuelve la fecha y hora de lo contrario solo devuelve solo la fecha
   */
   GetFechaHora(horas?: boolean): string{

    var date: any = new Date();
    var day: any = date.getDate();       // yields date
    var month: any = date.getMonth() + 1; // yields month (add one as '.getMonth()' is zero indexed)
    var year: any = date.getFullYear();  // yields year
    var hour: any = date.getHours();     // yields hours 
    var minute: any = date.getMinutes(); // yields minutes
    var second: any = date.getSeconds(); // yields seconds
    
    if(day < 10){
      day = "0"+day;
    }

    if(month < 10){
      month = "0"+month;
    }

    if(hour < 10) {
      hour = "0"+hour;
    }
    if(minute < 10) {
      minute = "0"+minute;
    }
    if(second < 10) {
      second = "0"+second;
    }

    var fecha: string = year + "-" + month + "-" + day;
    var fechayhora: string = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    
    return (horas)? fechayhora: fecha;
  }

    /**
   * 
   * Sesion de usuario
   * 
   */
  

  SetUsuarioLogeado(usuario: any): void
  {
    let usuario_string = JSON.stringify(usuario);
    localStorage.setItem("usuarioActual", usuario_string);
  }

  SetToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  GetToken() {
    return localStorage.getItem("accessToken");
  }

  GetUsuarioLogeado(): any {
    let usuario_string = localStorage.getItem("usuarioActual");
    if (!isNullOrUndefined(usuario_string)) {
      let usuario: any = JSON.parse(usuario_string); 
      return usuario;
    } else {
      return null;
    }
  }

  LogoutUser() {
    sessionStorage.removeItem('usuarioActual');
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuarioActual");
  }

  /**
   * Validador de Rut
   * 
   * @param rut Rut del usuario
   */
  public ValidarRut(rut: string): boolean{
    rut = rut.replace(/[^0-9\K\k]/g,'');

    if(rut.length < 8){
      return false;
    }

    var cuerpo = rut.slice(0,-1);
    var dv: any = rut.slice(-1).toUpperCase();

    var suma: number = 0;
    var multiplo: number = 2;
    var valor: any;

    for(var i: number=1;i<=cuerpo.length;i++) {

      valor = rut.charAt(cuerpo.length - i);
      var index: number = multiplo * valor;
      
      suma = suma + index;
      
      if(multiplo < 7){
        multiplo = multiplo + 1;
      }else{
        multiplo = 2;
      }
    }

    var dvEsperado = 11 - (suma % 11);
    
    dv = (dv == 'K')? 10:dv;
    dv = (dv == 0)? 11:dv;
    
    return (dvEsperado != dv)? false : true;
  }

  /**
   * Cerrar sesión
   */
  onLogout(): void {
    this.LogoutUser();
    this.router.navigate(['/login']);
  }

}
