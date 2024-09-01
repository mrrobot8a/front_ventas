import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';

import { CustomerApi } from '../interface/customer_api.interface';
import { CustomerResgiter } from '../interface/customer_register.interface';
import { AuthResponse } from '../../../../auth/interfaces';





@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  private readonly baseUrl: string = environment.baseUrl;

  private AuthService = inject(AuthService);
  private httpClient = inject(HttpClient);


  public getAllCustomers(): Observable<CustomerApi> {

    const url = `${this.baseUrl}/customers/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    });

    const result = this.httpClient.get<CustomerApi>(url, { headers }).pipe(

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


  public saveCustomer(customer: any): Observable<any> {

    console.log('save', customer);
    const token = localStorage.getItem('token');
    const body = { customer };
    const url = `${this.baseUrl}/customers/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',

    });


    const result = this.httpClient.post<CustomerApi>(url,customer, { headers }).pipe(

      delay(3000),

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


  public updateCustomer(customer: any): Observable<any> {

    console.log('save', customer);
    const token = localStorage.getItem('token');
    console.log('token', customer.id);

    const url = `${this.baseUrl}/customers/${customer.id}/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });


    const result = this.httpClient.put<CustomerApi>(url,customer, { headers }).pipe(

      delay(3000),

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

  public deleteCustomer(customer: any): Observable<any> {

      console.log('save', customer);
      const token = localStorage.getItem('token');
      console.log('token', customer.id);

      const url = `${this.baseUrl}/customers/${customer.id}/`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const result = this.httpClient.delete<CustomerApi>(url, { headers }).pipe(

        delay(3000),

        map(resp => {
          console.log('service user response:', resp);
          return of(true);
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
