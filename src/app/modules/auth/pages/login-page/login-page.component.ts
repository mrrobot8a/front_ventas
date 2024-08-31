import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/login-response.interface';
import { AlertService } from '../../../../shared/components/alerts/alert.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [

  ],
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {

  constructor(private router: Router) { }

  hide = true;
  isLoading = false;

  private alert = inject(AlertService);
  //la clase formbuider nos permite crear formularios reactivos
  private fb = inject(FormBuilder);
  //esto es como hacer un new de clase AuthService
  private authService = inject(AuthService);

  //creamos un formulario reactivo
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });


  login() {

  }


  tieneRolUsuario(usuario: any) {
    return usuario?.roles?.some((rol: any) => rol.authority.toLowerCase() === 'administrador') || false;
  }





}
