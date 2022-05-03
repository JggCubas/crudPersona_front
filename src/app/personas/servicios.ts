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
  }
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
