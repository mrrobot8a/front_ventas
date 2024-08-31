import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-layuot/dashboard.component';
import { Error404PageComponent } from '../../shared/pages/error404-page/error404-page.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '', // Ruta vacía para redireccionar a users
        pathMatch: 'full', // Se asegura de que la ruta vacía coincida exactamente
        redirectTo: 'users', // Redirige a la ruta de usuarios por defecto
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('./pages/producto/producto.module').then(m => m.ProductoModule),

      },
      {
        path: '404',
        component: Error404PageComponent,
      },
      {
        path: '**',
        redirectTo: '404',
      }

    ]


  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
