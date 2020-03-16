import { Injectable } from '@angular/core';
import { BackgroundGeolocation,
         BackgroundGeolocationConfig,
         BackgroundGeolocationResponse,
         BackgroundGeolocationEvents,
         BackgroundGeolocationLocationProvider } from '@ionic-native/background-geolocation/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertasService } from './alertas.service'
import { FuncionesService } from './funciones.service';
import { DbEleccionesService } from './db-elecciones.service';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  private hasGPS = new BehaviorSubject(false);

  constructor(
    private backgroundgeolocation: BackgroundGeolocation,
    private alertas: AlertasService,
    private funciones: FuncionesService,
    private db: DbEleccionesService) {
      this.onGps();
    }


  // Inicia el proceso de geolocalización
  public async GpsIniciar(): Promise<boolean> {
    let outerThis = this;
    var promise = new Promise<boolean>(function(resolve, reject) {
      outerThis.db.ObtenerParametroGps().then(intervalo => {
        console.log('Parametro Gps: ' + intervalo);
        const config: BackgroundGeolocationConfig = {
          locationProvider: BackgroundGeolocationLocationProvider.ACTIVITY_PROVIDER, // Proveedor de ubicación
          desiredAccuracy: 10, // Precisión de distancia (en metros)
          stationaryRadius: 1, // Radio donde se puede mover (en metros)
          distanceFilter: 1, // Distancia mínima donde se puede mover (en metros)
          debug: false, // Sondo de bip desactivado
          stopOnTerminate: true, // Desactivado el forzar detención
          interval: intervalo, // Intervalo de tiempo mínimo entre actualizacón (en milisegundos)
          fastestInterval: (intervalo / 2), // La tasa más rápida de manejo de actualización (en milisegundos)
          activitiesInterval: intervalo, // Velocidad en que se produce el reconocimiento de la actividad (en milisegundos)
          notificationsEnabled: false, // Notificacción de rastreo desactivada
          notificationTitle: 'Seguimiento', // Titulo de la notificación
          notificationText: 'Habilitado' // Texto de la notificación
          };

          outerThis.backgroundgeolocation.configure(config).then(() => {
            outerThis.backgroundgeolocation.on(BackgroundGeolocationEvents.location)
            .subscribe( (location: BackgroundGeolocationResponse) => {

              outerThis.alertas.Toast('Latitud: ' + location.latitude + ' Longitud: ' + location.longitude);
              outerThis.GuardarCoordenadas(location.latitude, location.longitude);

              resolve(true);
            }, error => {
              console.error(error);
              resolve(false);
            });
        }, error => {
          resolve(false);
        });
        outerThis.backgroundgeolocation.start();
      });
    });
    return promise;
  }

  public GpsValidar(): Observable<boolean> {
    return this.hasGPS.asObservable();
  }

  // Validaciones de estados del GPS
  private onGps(): void {

    this.GpsAutorizacion().then(dato => {
      if (!dato) {
        this.backgroundgeolocation.showAppSettings();
        this.alertas.Alerta('Debe activar los permisos de ubicación');
      }
      return;
    });

    this.GpsActivado().then(dato => {
      if (!dato) {
        this.alertas.Alerta('Debe activar el GPS');
      }
      return;
    });
  }

  // Validación de autorización del usoa de la ubicación
  private async GpsAutorizacion(): Promise<boolean> {
    return this.backgroundgeolocation.checkStatus().then((status) => {
      if (!status.authorization) {
        this.backgroundgeolocation.showAppSettings();
        this.hasGPS.next(false);
        return false;
      } else {
        this.hasGPS.next(true);
        return true;
      }
    });
  }

  // Validación del GPS activado
  private async GpsActivado(): Promise<boolean> {
    return this.backgroundgeolocation.checkStatus().then((status) => {
      if (!status.locationServicesEnabled) {
          console.log('GPS Desactivado');
          this.hasGPS.next(false);
          return false;
      } else {
        console.log('GPS Activado');
        this.hasGPS.next(true);
        return true;
      }
    });
  }

  // Detiene el proceso de localización
  public GpsDetener(): void {
    this.backgroundgeolocation.stop();
  }

  // Inserta las coordenadas en la BD local
  private GuardarCoordenadas(lat: number, lon: number) {
    var Usuario = this.funciones.GetUsuarioLogeado();

    if (Usuario !== undefined && Usuario !== null) {
      this.db.InsertCoordenadasUsuarios(Usuario.usuario.USU_ID, lat, lon);
    } else {
      console.error('No se obtuvo el ID del usuario logeado');
    }
  }

}
