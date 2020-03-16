import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ModalController } from '@ionic/angular';
import { DbEleccionesService } from 'src/app/services/db-elecciones.service';
@Component({
  selector: 'app-asignar-cargas',
  templateUrl: './asignar-cargas.page.html',
  styleUrls: ['./asignar-cargas.page.scss'],
})
export class AsignarCargasPage implements OnInit {
  codigos = [];
  constructor(
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    private alert: AlertasService,
    private modalController: ModalController,
    private db: DbEleccionesService
  ) {
    this.db.ObtenerCargas().then(dato => {
      console.log('cargasAll: ', dato);
    });

   }

  ngOnInit() {

  }

  async abrirCamara() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.validarCodigo(barcodeData.text);
      // this.codigos.push(barcodeData.text);
     }).catch(err => {
         console.log('Error', err);
     });
  }
  async validarCodigo(codigo: string) {
    console.log('validarCodigo ', codigo);
    // tslint:disable-next-line: no-shadowed-variable
    await this.db.ObtenerCargaByCodigo(codigo).then( codigo => {
      console.log('ObtenerCargaByCodigo', codigo);
      if ( codigo.length > 0) {
        console.log(codigo[0]);
        this.codigos.push(codigo[0]);
      } else {
        this.alert.Alerta('Código no existe.');
      }
    });
  }

  async asignarCarga() {
    console.log('asignar carga servicio');
    await this.modalController.dismiss(this.codigos);
    // this.route.navigate(['/mis-rutas']);
    this.alert.Toast('Se a asigandor correctamente.');
  }
}
