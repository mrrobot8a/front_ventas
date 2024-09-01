import { Injectable, computed, PLATFORM_ID, inject, signal, Inject, AfterViewInit, OnInit } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, delay, map, of, tap, throwError, timer } from "rxjs";
import { AuthResponse, AuthStatus, CheckTokenResponse, User, } from "../interfaces";

import { isPlatformBrowser } from '@angular/common';
import { environment } from "../../../../environments/enviroments";
import { decodeToken, mapTokenToUser, hasTokenExpired } from '../helper/decode-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AfterViewInit, OnInit {


  // readonly para evitar que se modifique el valor de la variable en tiempo de ejecución
  // exponemos la base url para que sea accesible desde cualquier componente
  private readonly baseUrl: string = environment.baseUrlAuth;
  private http = inject(HttpClient);
  // signal es una variable reactiva que nos permite emitir valores a los componentes que estén suscritos a ella
  private _currrentUser = signal<User | null>(null);
  // el estado de la autenticacoin es un observable que nos permite saber si el usuario esta autenticado o no
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  // computed es una función que nos permite obtener el valor de una variable reactiva
  public currentUser = computed(() => this._currrentUser());
  public authStatus = computed(() => this._authStatus());

  private readonly platformId = inject(PLATFORM_ID);


  constructor() {
    console.log('1')
    this.checkAuthentication().subscribe();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {


  }


  public checkAuthentication(): Observable<boolean> {
    console.log('checkToken');

    const url = `${this.baseUrl}/check-token`;
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);

    // Simula el retraso de la petición HTTP
    return timer(3000).pipe(
      map(() => {
        if (token) {
          this._setAuthentication(user, token, AuthStatus.authenticated);
          return true;
        } else {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return false;
        }
      })
    );
  }


  public login(email: string, password: string): Observable<any> {

    const url = `${this.baseUrl}`;
    const body = { email, password };

    const result = this.http.post<AuthResponse>(url, body).pipe(
      delay(3000),
      tap((resp) => console.log(resp, 'resp')),
      map((resp) => {

        const { user, access } = resp;
        this._setAuthentication(user, access, AuthStatus.authenticated);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }),
      //nos permite capturar el error que nos devuelve la peticion http
      catchError((error: any | any) => {
        console.log(error, 'error')
        if (error.status === 0) {
          return throwError(() => 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.');
        }
        if (error.status === 401) {
          return throwError(() => 'Usuario o contraseña incorrectos');
        }
        if (error.status === 403) { }
        const { success, error: errorMessage } = error.error;
        console.log(errorMessage, 'error')

        return throwError(() => errorMessage);
      }),
    );

    return result;

  }

  public logout(): void {
    this._setAuthentication(null, undefined, AuthStatus.notAuthenticated);
    localStorage.removeItem('user');
  }






  private _setAuthentication(user: User | null, token?: string, authStatus?: AuthStatus): boolean {
    console.log(authStatus, 'service');
    console.log('user', user);
    this._currrentUser.set(user);
    this._authStatus.set(authStatus!);

    if (token !== undefined && user !== null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    return true;
  }




}

