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
                  case "DEV"  : this.urlServicios = "http://10.200.7.90/api/"; break;
                  case "QA"   : this.urlServicios = "https://eleccioneswsqa.cl/api/"; break;
                  case "LOCAL": this.urlServicios = "https://localhost:44349/api/"; break;
                }

                
              }
  
  headers = new HttpHeaders().set('Content-Type', 'application/json')
  .append('Authorization', 'Bearer ' + 'Ant1c1p4')
  private data = [];

  /**
   * Metodos de la API
   */
  ObtenerLoginUsuario(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'usuario/'+'ObtenerLoginUsuario',parametro, {headers:this.headers});
  }

  ObtenerParametros(): Observable<any> {
    return this.http.post(this.urlServicios+'parametro/'+'ObtenerParametros','',{headers:this.headers});
  }

  ObtenerEstadoInicioFinDia(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'registroiniciofindia/'+'ObtenerEstadoInicioFinDia',parametro,{headers:this.headers});
  }

  ObtenerPerfiles(): Observable<any> {
    return this.http.post(this.urlServicios+'perfil/'+'ObtenerPerfiles'+'ObtenerPerfiles','',{headers:this.headers});
  }

  GuardarCoordenadasUsuario(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'usuario/'+'GuardarCoordenadasUsuario',parametro,{headers:this.headers}); 
  }

  GuardarInicioFinDiaOnline(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'registroiniciofindia/'+'GuardarInicioFinDiaOnline', parametro,{headers:this.headers});
  }

  GuardarInicioFinDiaOffline(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'registroiniciofindia/'+'GuardarInicioFinDiaOffline', parametro,{headers:this.headers});
  }

  GuardarRegistroSesion(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'usuario/'+'GuardarRegistroSesion', parametro, {headers: this.headers});
  }

  ObtenerEntregaFinal(parametro): Observable<any>{
    return this.http.post(this.urlServicios+'usuario/'+'ObtenerEntregaFinal', parametro, {headers: this.headers});
  }

  ObtenerTipoLugares(): Observable<any>{
    return this.http.post(this.urlServicios+'tipolugar/'+'ObtenerTipoLugares', '', {headers: this.headers});
  }

  ObtenerTipoCarga(): Observable<any>{
    return this.http.post(this.urlServicios+'tipocarga/'+'ObtenerTipoCarga','', {headers: this.headers});
  }

  ObtenerRegiones(): Observable<any>{
    return this.http.post(this.urlServicios+'region/'+'ObtenerRegiones','', {headers: this.headers});
  }

  ObtenerProvincias(): Observable<any>{
    return this.http.post(this.urlServicios+'provincia/'+'ObtenerProvincias','', {headers: this.headers});
  }

  ObtenerMesas(): Observable<any>{
    return this.http.post(this.urlServicios+'mesa/'+'ObtenerMesas','',{headers: this.headers});
  }

  ObtenerLugares(): Observable<any>{
    return this.http.post(this.urlServicios+'lugar/'+'ObtenerLugares','', {headers: this.headers});
  }

  ObtenerLocalesVotacion(): Observable<any>{
    return this.http.post(this.urlServicios+'localvotacion/'+'ObtenerLocalesVotacion','', {headers: this.headers});
  }

  ObtenerEstadoRuta(): Observable<any>{
    return this.http.post(this.urlServicios+'estadoruta/'+'ObtenerEstadoRuta','',{headers: this.headers});
  }

  ObtenerEstadoCarga(): Observable<any>{
    return this.http.post(this.urlServicios+'estadocarga/'+'ObtenerEstadoCarga','',{headers: this.headers});
  }

  ObtenerComuna(): Observable<any>{
    return this.http.post(this.urlServicios+'comuna/'+'ObtenerComunas','',{headers: this.headers});
  }

  ObtenerCircunscripciones(): Observable<any>{
    return this.http.post(this.urlServicios+'circunscripcion/'+'ObtenerCircunscripciones','',{headers: this.headers});
  }





























}
