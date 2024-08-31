import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/enviroments';
import { Document_Type } from '../interface/document_type.interface';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor() { }

  private readonly baseUrl: string = environment.baseUrl;


  private httpClient = inject(HttpClient);

  public getDocument(): Observable<any> {

    const url = `${this.baseUrl}/document-types/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const result = this.httpClient.get<Document_Type>(url, { headers }).pipe(

      delay(3000), // Simular demora (si es necesario)

      map(resp => {
        console.log('service user response:', resp);
        return resp;
      }),

      catchError(error => {
        console.log('service user error:', error);
        if (error.status === 0) {
          console.log('Error 0');
          return throwError(() => new Error('Error en el servidor'));
        }
        if (error.status === 403) {
          console.log('Error 403');
          return throwError(() => new Error(error.error));
        }

        return throwError(() => new Error('Error procesando la petición get all user'));
      }),


    );

    return result;
  }


}
