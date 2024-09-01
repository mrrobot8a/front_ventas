
import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, Renderer2, computed, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { SharedModule } from "../../shared.module";
import { User } from '../../../modules/auth/interfaces/login-response.interface';


export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}


@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-.sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
  standalone: true,
  animations: [
    trigger('widthAnimation', [
      state('expanded', style({
        width: '80px'
      })),
      state('collapsed', style({
        width: '44px'
      })),
      transition('expanded => collapsed', [
        animate('0.5s')
      ]),
      transition('collapsed => expanded', [
        animate('0.5s')
      ])
    ]),
    trigger('textAnimation', [
      // opacity
      state('visible', style({
        opacity: 1,
        width: '50%'
      })),
      state('hidden', style({
        opacity: 0,
        width: '0%'
      })),
      transition('visible => hidden', [
        animate('0.3s')
      ]),
      transition('hidden => visible', [
        animate('0.3s')
      ])
    ]),
  ],
  imports: [CommonModule, MaterialModule, RouterModule, SharedModule]
})



export class CustomSidenavComponent implements OnInit {

  sideNavCollapsed = signal(false);



  @Input() set collapsedPadre(val: boolean) {
    this.sideNavCollapsed.set(val);
  };

  @Input() currentUser?: User | null;



  public menuItems = signal<MenuItem[]>([]);


  ngOnInit() {


    console.log(this.currentUser);

    const rol = this.tieneRolUsuario(this.currentUser);
    // Obtener las opciones del menú según el tipo de usuario
    const menuItems = this.getMenuItemsByPage(rol || '');

    // Actualizar las opciones del menú mediante la señal menuItems
    this.menuItems.set(menuItems);
  }


  //onbtener el valor provider de user-routing.module.ts menuroutes , useVALUE:routes
  constructor(

    @Inject('menuRoutes') private menuRoutes: any[],
    private auhtService : AuthService
  ) {


  }




  getMenuItemsByPage(rol: string): MenuItem[] {

    console.log(rol, 'rol');
    switch (rol.toLowerCase()) {
      case 'administrador':
        return [
          { icon: 'account_circle', label: 'Clientes', route: 'customer/list' },
          { icon: 'production_quantity_limits', label: 'Productos', route: 'products/list' },

        ];
      default:
        return [];
    }
  }

  tieneRolUsuario(usuario: any): string {
    return usuario.roles[0];
  }

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '70px' : '256px');

  mariginLeft = computed(() => this.collapsed() ? '89px' : '266px');

  profilePicSize = computed(() => this.collapsed() ? '40' : '80');

  visibleText = computed(() => this.collapsed() ? true : false);

  sizeTitle = computed(() => this.collapsed() ? '0' : '20');

  currentRolUser = computed(() => this.tieneRolUsuario(this.currentUser));


  nameUserAbbreviated = computed(() => {
    console.log('nameUserAbbreviated--Veces llamada');

    const fullName = this.currentUser?.name_user; // Obtener el valor actual de la señal


    if (!this.collapsed()) {
      return fullName;
    } else {
      const words = fullName!.split(' '); // Usar métodos de string en el valor actual
      const initials = words.map((word: string) => word.charAt(0)).join('');
      return initials.toUpperCase();
    }
  });



  onLogout() {


    this.auhtService.logout();

  }


}
