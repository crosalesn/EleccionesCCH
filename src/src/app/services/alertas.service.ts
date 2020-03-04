import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(public toastAlerta: ToastController, public alert: AlertController) { 

  }

  //Mensaje de Toast, levanta una notificación

  /**
   * Mensaje Toast, levanta una notificación por unos segundos
   * 
   * @param mensaje Texto que llevará el mensaje
   * @param tiempo (Opcional) Duración en milisegundos, por defecto 2000
   * @param posicion (Opcional) valores: 1=Arriba - 2=Centro - 3=Abajo
   */
  public async Toast(mensaje:string, tiempo?:number, posicion?:number): Promise<any>{
      let alert: any;
      let time: number = (tiempo != undefined && tiempo != null && tiempo > 0)? tiempo: 2000;
      let lugar: any = 'bottom';

      if(posicion != undefined){
        switch(posicion){
          case 1: lugar = 'top'; break;
          case 2: lugar = 'middle'; break;
          case 3: lugar = 'bottom'; break;
          default: lugar = 'bottom'; break;
        }
      }

      alert = await this.toastAlerta.create({
        message: mensaje,
        duration: time,
        position: lugar
      });

      await alert.present();
  }

  /**
   * Mensaje Alerta, levanta un mensaje tipo modal en el centro de la pantalla
   * 
   * @param mensaje Texto que llevará el mensaje
   */
  public async Alerta(mensaje:string){
    let alert = await this.alert.create({
      message: mensaje,
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

    await alert.present();
  }

}
