import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class peticiones_service {
  private path = [
        'http://localhost:8080/personas'
  ];
  constructor(private http: HttpClient) {}

  getListPersonas():Observable<any>{
    return this.http.get<any>(this.path[0], {  })
      .pipe(
        catchError(this.error)
      );
  }//End_function
  setNewPersona(data:{}):Observable<any>{
    return this.http.post<any>(this.path[0], { nodo:data })
      .pipe(
        catchError(this.error)
      );
  }//End_function
  removePersona(id:number):Observable<any>{
    return this.http.delete<any>(this.path[0]+'/'+id)
      .pipe(
        catchError(this.error)
      );
  }//End_function
  updatePersona(id:number,data:{}):Observable<any>{
    return this.http.put<any>(this.path[0]+'/'+id,{nodo:data})
      .pipe(
        catchError(this.error)
      );
  }//End_function
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
