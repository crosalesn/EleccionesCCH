import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private hasConnection = new BehaviorSubject(false);

  constructor(private network: Network, private http: HttpClient) { 
    this.onNetwork();
  }

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
