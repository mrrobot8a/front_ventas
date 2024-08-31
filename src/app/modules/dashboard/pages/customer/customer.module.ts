import { NgModule } from '@angular/core';


import { CustomerRoutingModule} from './customer-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CustomSidenavComponent } from '../../../../shared/components/custom-sidenav/custom-sidenav.component';
import { CustomTableComponent } from '../../../../shared/components/Custom-table/Custom-table.component';
import { SharedModule } from '../../../../shared/shared.module';



@NgModule({
    declarations: [
        ListPageComponent
    ],
    providers: [provideHttpClient(withFetch())],
    imports: [
        CommonModule,
        SharedModule,
        CustomerRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        CustomSidenavComponent,
        CustomTableComponent
    ]
})
export class CustomerModule { }
