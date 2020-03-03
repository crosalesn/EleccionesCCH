import { Injectable } from '@angular/core';
import { isNullOrUndefined } from "util";
import { BackgroundGeolocation, 
  BackgroundGeolocationConfig, 
  BackgroundGeolocationResponse, 
  BackgroundGeolocationEvents, 
  BackgroundGeolocationLocationProvider } from '@ionic-native/background-geolocation/ngx';
import { ToastController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { DbEleccionesService } from './db-elecciones.service';
import { EleccionesService } from './elecciones.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private online: Observable<boolean> = null;
  private hasConnection = new BehaviorSubject(false);
  private hasGPS = new BehaviorSubject(false);

  constructor(public toast: ToastController, 
    public alert: AlertController, private backgroundgeolocation: BackgroundGeolocation,
    private activatedRoute: ActivatedRoute, private router:Router, private network: Network,
    private dbEleccionesService: DbEleccionesService, private eleccionesService: EleccionesService,
    private http: HttpClient) { 
    
      this.eleccionesService.ObtenerParametroGPS().subscribe((parametro) => {
        this.GpsIniciar(parseInt(parametro.PAR_VALOR));
      }, error =>{
        this.GpsIniciar(10000);
      });

     this.onNetwork();
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
    * Mensajes de alerta
    * 
    * @param msn Mensaje a mostrar en la alerta
    * @param type Opcional, si se ingresa algún valor muestra mensaje en un Alert,
    *             de lo contrario muestra el mensaje en un Toast
    */
  async msn(msn: string, type?: any){
    let alert: any;

    if(type == null || type == undefined){
      alert = await this.toast.create({
        message: msn,
        duration: 1500,
        buttons: ['Aceptar']
      });
    }else {
      alert = await this.alert.create({
        message: msn,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancelar',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cancelar');
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              console.log('Aceptar');
            }
          }
        ]
      });
    }

    await alert.present();
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
   * Geolocalización
   */

   //Inicia el proceso de geolocalización
   private GpsIniciar(intervalo: number): void{

      const config: BackgroundGeolocationConfig = {
      locationProvider: BackgroundGeolocationLocationProvider.ACTIVITY_PROVIDER, //Proveedor de ubicación
      desiredAccuracy: 10, //Precisión de distancia (en metros)
      stationaryRadius: 1, //Radio donde se puede mover (en metros)
      distanceFilter: 1, //Distancia mínima donde se puede mover (en metros)
      debug: false, //Sondo de bip desactivado
      stopOnTerminate: true, //Desactivado el forzar detención
      interval: intervalo, //Intervalo de tiempo mínimo entre actualizacón (en milisegundos)
      fastestInterval: (intervalo/2), //La tasa más rápida de manejo de actualización (en milisegundos)
      activitiesInterval: intervalo, //Velocidad en que se produce el reconocimiento de la actividad (en milisegundos)
      notificationsEnabled: false, //Notificacción de rastreo desactivada
      notificationTitle: 'Seguimiento', //Titulo de la notificación
      notificationText: 'Habilitado' //Texto de la notificación
      };
      this.backgroundgeolocation.configure(config).then(() => {
        this.backgroundgeolocation.on(BackgroundGeolocationEvents.location)
        .subscribe( (location: BackgroundGeolocationResponse) => {

          var Usuario = this.GetUsuarioLogeado();
          this.onGps();
          
          if(Usuario !== undefined && Usuario !== null){
            this.msn("Usuario: "+Usuario.usuario.USU_ID+" Latitud: "+location.latitude+" Longitud: "+location.longitude);
            this.dbEleccionesService.InsertCoordenadasUsuarios(Usuario.usuario.USU_ID, location.latitude, location.longitude);
          }else{
            console.error("No se obtuvo el ID del usuario logeado");
          }
            
        });
      });
      this.backgroundgeolocation.start();
  }

  public GpsValidar(): boolean {
    return this.hasGPS.value;
}

  //Validaciones de estados del GPS
  private onGps(): void{

    this.GpsAutorizacion().then(dato =>{
      if(!dato){
        this.backgroundgeolocation.showAppSettings();
        this.msn("Debe activar los permisos de ubicación",true);
      }
      return;
    });

    this.GpsActivado().then(dato =>{
      if(!dato){
        this.msn("Debe activar el GPS",true);
      }
      return;
    });
  }

  //Validación de autorización del usoa de la ubicación
  private async GpsAutorizacion(): Promise<boolean>{
    return this.backgroundgeolocation.checkStatus().then((status) => {
      if(!status.authorization){
        this.backgroundgeolocation.showAppSettings();
        this.hasGPS.next(false);
        return false;
      }else{
        this.hasGPS.next(true);
        return true;
      }
    });
  }

  //Validación del GPS activado
  private async GpsActivado(): Promise<boolean>{
    return this.backgroundgeolocation.checkStatus().then((status) => {
      if(!status.locationServicesEnabled){
          console.log("GPS Desactivado");
          this.hasGPS.next(false);
          return false;
      }else{
        console.log("GPS Activado");
        this.hasGPS.next(true);
        return true;
      }
    });
  }

  //Detiene el proceso de localización
  private GpsDetener(): void{
    this.backgroundgeolocation.stop();
  }

  /**
   * Cerrar sesión
   */
  onLogout(): void {
    this.GpsDetener();
    this.LogoutUser();
    this.router.navigate(['/login']);
  }

  /**
   * Conexión a internet
   * 
   */
  //Verifica si tiene conexión a internet
  private onNetwork(): void{

    this.network.onConnect().subscribe(() => {
      console.log('Conectado');
      this.hasConnection.next(true);
      return;
    });

    this.network.onDisconnect().subscribe(() => {
      console.log('Desconectado');
      this.hasConnection.next(false);
      return;
    });

    this.testNetworkConnection();
  }

  //Muestra el tipo de conexión a internet: 2G, 3G, 4G, wifi, etc.
  public getNetworkType(): string {
    return this.network.type;
  }

  //Obtiene el estado de la conexión
  public getNetworkStatus(): boolean {
      return this.hasConnection.value;
  }

  public async checkNetworkStatusNow(): Promise<boolean> {
     return this.http.get('http://10.200.7.90/test').toPromise().then(succes => {
       return true;
     },
     error => {
       return false;
     });
  }

  private getNetworkTestRequest(): Observable<any> {
      return this.http.get('http://10.200.7.90/test/');
  }

  private async testNetworkConnection() {
      try {
          this.getNetworkTestRequest().subscribe(
          success => {
                  this.hasConnection.next(true);
              return;
          }, error => {
              this.hasConnection.next(false);
              return;
          });
      } catch (error) {
          this.hasConnection.next(false);
          return;
    }
  }


}
