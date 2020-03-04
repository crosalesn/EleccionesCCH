import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleccionesService {
  
  private urlServicios: string;
  constructor(private http: HttpClient) { 

                var server: string = "DEV";
                switch(server){
                  case "DEV"  : this.urlServicios = "http://10.200.7.90/api/usuario/"; break;
                  case "QA"   : this.urlServicios = "https://eleccioneswsqa.cl/api/usuario/"; break;
                  case "LOCAL": this.urlServicios = "https://localhost:44349/api/usuario/"; break;
                }

                
              }
  
  headers = new HttpHeaders().set('Content-Type', 'application/json')
  .append('Authorization', 'Bearer ' + 'Ant1c1p4')
  private data = [];

  /**
   * Metodos de la API
   */
  ObtenerLoginUsuario(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'ObtenerLoginUsuario',parametro, {headers:this.headers});
  }

  ObtenerParametros(): Observable<any> {
    return this.http.post(this.urlServicios+'ObtenerParametros','',{headers:this.headers});
  }

  ObtenerEstadoInicioFinDia(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'ObtenerEstadoInicioFinDia',parametro,{headers:this.headers});
  }

  ObtenerPerfiles(): Observable<any> {
    return this.http.post(this.urlServicios+'ObtenerPerfiles','',{headers:this.headers});
  }

  GuardarCoordenadasUsuario(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'GuardarCoordenadasUsuario',parametro,{headers:this.headers}); 
  }

  GuardarInicioFinDiaOnline(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'GuardarInicioFinDiaOnline', parametro,{headers:this.headers});
  }

  GuardarInicioFinDiaOffline(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'GuardarInicioFinDiaOffline', parametro,{headers:this.headers});
  }

}
