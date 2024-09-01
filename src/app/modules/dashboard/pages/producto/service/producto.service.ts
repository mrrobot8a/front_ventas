import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { TokenService } from '../../../../../shared/util/token.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';

import { ProductApi } from '../interface/producto_api.interface';



@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  private readonly baseUrl: string = environment.baseUrl;
  private tokenService = inject(TokenService);
  private AuthService = inject(AuthService);
  private http = inject(HttpClient);


  public getAllProducts(): Observable<ProductApi> {

    const url = `${this.baseUrl}/products/`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const result = this.http.get<ProductApi>(url, { headers }).pipe(

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

  public saveProduct(product: ProductApi): Observable<ProductApi> {

    const url = `${this.baseUrl}/products/`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const result = this.http.post<ProductApi>(url, product, { headers }).pipe(

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

  public updateProduct(product: ProductApi): Observable<ProductApi> {

      const url = `${this.baseUrl}/products/${product.id_product}/`;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const result = this.http.put<ProductApi>(url, product, { headers }).pipe(

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

    public deleteProduct(product: ProductApi): Observable<ProductApi> {

        const url = `${this.baseUrl}/products/${product.id_product}/`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

        const result = this.http.delete<ProductApi>(url, { headers }).pipe(

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
