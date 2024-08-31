import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../../environments/enviroments';
import { TokenService } from '../../../../../shared/util/token.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, delay, map, of, switchMap, throwError } from 'rxjs';
import { RolePegableResponse } from '../interface/role_pegination_response.interface';

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
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

  public getAllRoles(page?: number, size?: number): Observable<any> {
    return this.tokenService.getToken().pipe(
      switchMap(token => {
        if (token == null) {
          console.log('No existe token en el localStorage');
          return of(false); // Manejo adecuado de la ausencia de token
        }
        // http://localhost:8000/admin/get-all-roles
        const url = `${this.baseUrl}/admin/get-all-roles?page=${page}&size=${size}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        //start-petticion
        return this.http.get<RolePegableResponse>(url, { headers }).pipe(
          delay(3000), // Simular demora (si es necesario)
          map(resp => {
            console.log('service role response:', resp);
            return resp
          }),
          catchError(error => {
            console.log('service role error:', error);
            if (error.status === 0) {
              console.log('Error 0');
              return throwError(() => new Error('Error en el servidor'));
            }
            if (error.status === 403) {
              console.log('Error 403');

              return throwError(() => new Error(error.error));
            }
            return throwError(() => new Error(error.error));
          })
        );
      }),
      catchError(error => {
        console.error('Error en el proceso de obtención del token o en la petición HTTP', error);
        return throwError(() => error);
      })
    );
  }





}
