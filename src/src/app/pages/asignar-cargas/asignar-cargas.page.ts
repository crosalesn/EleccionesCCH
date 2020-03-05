import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
@Component({
  selector: 'app-asignar-cargas',
  templateUrl: './asignar-cargas.page.html',
  styleUrls: ['./asignar-cargas.page.scss'],
})
export class AsignarCargasPage implements OnInit {
  codigos: string[] = [
    "EFTV-35766878564",
    "EFTV-35766878565"
  ];
  constructor(
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    private alert: AlertasService
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
  
  asignarCarga() {
    console.log("asignar carga servicio");
    this.route.navigate(['/mis-rutas']);
    this.alert.Toast("Se a asigandor correctamente.");
  }
}
