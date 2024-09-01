import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { Router } from '@angular/router';

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
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      {
        next: (resp: any) => {
          console.log(resp, 'resp');
          this.isLoading = false;
          this.router.navigate(['/']);
          this.alert.success('Bienvenido', 'success', 'Bienvenido a la aplicación', 3000, 'top-end','green');
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.alert.error('Error', 'Usuario o contraseña incorrectos','error', 3000, 'top-end','red');

        }
      }
    );

  }


  tieneRolUsuario(usuario: any) {
    return usuario?.roles?.some((rol: any) => rol.authority.toLowerCase() === 'administrador') || false;
  }





}
