import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/enviroments';
import { SupplierApi, Suppliers } from '../interface/suppliers_Api.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  private readonly baseUrl: string = environment.baseUrl;

  private http = inject(HttpClient);

  constructor() { }


  public getAllSuppliers(): Observable<Suppliers> {

    const url = `${this.baseUrl}/suppliers/`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const result = this.http.get<Suppliers>(url, { headers }).pipe(

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
