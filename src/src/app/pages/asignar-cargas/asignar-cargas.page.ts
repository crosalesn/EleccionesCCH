import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-asignar-cargas',
  templateUrl: './asignar-cargas.page.html',
  styleUrls: ['./asignar-cargas.page.scss'],
})
export class AsignarCargasPage implements OnInit {
  codigos: string[] = [];
  constructor(
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    private alert: AlertasService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  abrirCamara() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.codigos.push(barcodeData.text);
     }).catch(err => {
         console.log('Error', err);
     });
  }
  
  async asignarCarga() {
    console.log("asignar carga servicio"); 
    await this.modalController.dismiss(this.codigos);
    //this.route.navigate(['/mis-rutas']);
    this.alert.Toast("Se a asigandor correctamente.");
  }
}
