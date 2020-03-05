import { Component, OnInit, NgZone } from '@angular/core';
import { EleccionesService } from '../../services/elecciones.service';
import { SincronizarPage } from '../../pages/sincronizar/sincronizar.page';
import { Router, ActivatedRoute} from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { NavController } from '@ionic/angular';
import { SincronizarService } from 'src/app/services/sincronizar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public sincronizarPage = SincronizarPage;
  constructor(
    public navCtrl: NavController, 
    private eleccionesService:EleccionesService, 
    private router: Router, private zone: NgZone,
    private funciones: FuncionesService, 
    private sincronizar: SincronizarService
  ) { 
  
  }

  ngOnInit() {
    
  }



  onLogout(): void {
    this.funciones.onLogout();
  }

  startSync() {
    console.log("startsync");
    this.sincronizar.Sincronizar();
  }

}
