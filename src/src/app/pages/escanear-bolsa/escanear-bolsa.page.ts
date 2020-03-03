import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { EleccionesService } from '../../services/elecciones.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-escanear-bolsa',
  templateUrl: './escanear-bolsa.page.html',
  styleUrls: ['./escanear-bolsa.page.scss'],
})

export class EscanearBolsaPage implements OnInit {

  private zbarOptions: any;

  private codigos: object;
  private sobrantes: object;
  private valores: any;

  private contador: number = 0;
  private contadorSobrante: number = 0;
  private max: number;
  private avance: any = 0;

  constructor(private zbar: ZBar, private eleccionesService: EleccionesService, 
    private plataform: Platform, private nativeAudio: NativeAudio) {

      this.plataform.ready().then(() => {
        this.nativeAudio.preloadSimple('beep', 'assets/music/beep.mp3').then((audio) => {
          console.log("Audio cargado: "+audio);
        }).catch(error => {
          console.log("Error de audio: "+error);
        });
      });

    this.codigos = 
      {
        "valores": [
          {
            "codigo": "WDUUV0B3U9KRMD",
            "isChecked": "0"
          },
          {
            "codigo": "5901234123457",
            "isChecked": "0"
          }
        ]
    }

    this.sobrantes = {};
    this.valores = {
      valores: []
    };

    this.max = Object.keys(this.codigos['valores']).length;

    this.zbarOptions = {
      flash: 'auto',
      drawSight: true,
      text_title: 'Comience a escanear',
      text_instructions: 'Escaneando'
    }

  }

  Escanear(){
    var PushSobrante: number = 0;

    this.zbar.scan(this.zbarOptions).then(result => {

      this.nativeAudio.play('beep');

      for(var codigo of this.codigos['valores']) {
        if (codigo.codigo === result) {
          if(codigo.isChecked === "0"){
            codigo.isChecked = "1";
            this.contador++;
            this.avance += (this.contador*this.max)*0.1;
            PushSobrante = 0;
            break;
          }else{
            PushSobrante = 0;
            break;
          }
        }else{
          PushSobrante = 1;
        }
      }

      if(PushSobrante == 1){
        for(var valor of this.valores['valores']) {
          if (valor.codigo === result) {
            PushSobrante = 0;
            break;
          }
        }
      }

      if(PushSobrante == 1){
        this.contadorSobrante ++;
          this.valores['valores'].push({
            "codigo": result,
            "isChecked": "1"
          });
      }

      this.zbarOptions.text_title = "Código: "+result;
      this.zbarOptions.text_instructions = this.contador+" de "+this.max+" formularios";
      var json = JSON.stringify(this.valores);
      this.sobrantes = JSON.parse(json);

      return this.Escanear();

   }).catch((error) => {
     console.log("Error: "+error);
   });
  }

  ngOnInit() { }

}
