import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
/**
 * Mi clase para los servicios de http
 */
export class peticiones_service {
  private path = [
        'http://localhost:8080/personas',
        'http://localhost:8080/personas/uploadfile',
        'http://localhost:8080/personas/getAvatar',
  ];
  constructor(private http: HttpClient) {}
  /**
 * @returns Regresa la ruta para leer las imagen alojada en el back
 */
  getPath():string{return this.path[2];}
  /**
 * @returns El objeto con todos las personas alojadas en la base de datos
 */
  getListPersonas():Observable<any>{
    return this.http.get<any>(this.path[0], {  })
      .pipe(
        catchError(this.error)
      );
  }//End_function
  /**
 * @param {objeto} data que contiene el from con los valores a guardar
 * @returns retorna el objeto con el id adignado en el proceso del back
 */
  setNewPersona(data:{}):Observable<any>{
    return this.http.post<any>(this.path[0], { nodo:data })
      .pipe(
        catchError(this.error)
      );
  }//End_function
  /**
 * @param {number} id  es el id del registro a borrar
 */
  removePersona(id:number):Observable<any>{
    return this.http.delete<any>(this.path[0]+'/'+id)
      .pipe(
        catchError(this.error)
      );
  }//End_function
  /**
 * @param {number, objeto} id,data  Recibe los parametos id a actualizar, y el from de los nuevos valores
 * @returns Retorna los valores ya procesados por el back
 */
  updatePersona(id:number,data:{}):Observable<any>{
    return this.http.put<any>(this.path[0]+'/'+id,{nodo:data})
      .pipe(
        catchError(this.error)
      );
  }//End_function
  /**
 * @param {file} file El archivo a subir
 * @returns Retorna la ruta que aroja el back.
 */
  uploadFile( file: File): Observable<any> {
    if(!file){return throwError("");}
    let formData = new FormData();
    formData.append('upload',file, file.name);

    let params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
    };
    const req = new HttpRequest('POST', this.path[1], formData, options);
    return this.http.request(req);
  }//Endfuncion
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }//Endfuncion
}
