import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-layuot/dashboard.component';
import { CustomSidenavComponent } from '../../shared/components/custom-sidenav/custom-sidenav.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ProductoModule } from './pages/producto/producto.module';
import { CustomerModule } from './pages/customer/customer.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    CustomerModule,
    ProductoModule,
    CustomSidenavComponent
  ]
})
export class DashboardModule { }
