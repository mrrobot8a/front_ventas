import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CustomSidenavComponent } from '../../../../shared/components/custom-sidenav/custom-sidenav.component';
import { CustomTableComponent } from '../../../../shared/components/Custom-table/Custom-table.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ListRolPageComponent } from './pages/list-page/lsit_rol_page.component';
import { ProductoRoutingModule } from './producto-routing.module';



@NgModule({
    declarations: [
      ListRolPageComponent
    ],
    providers: [provideHttpClient(withFetch())],
    imports: [
        CommonModule,
        SharedModule,
        ProductoRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        CustomSidenavComponent,
        CustomTableComponent
    ]
})
export class ProductoModule { }
