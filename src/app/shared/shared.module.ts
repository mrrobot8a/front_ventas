import { NgModule } from '@angular/core';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { LoadingIndicatorComponent } from './loading/isLoading/isLoading.component';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './components/Custom-table/Custom-table.component';
import { LoadingpulsoComponent } from './loading/isLoadingPulso/loadingpulso/loadingpulso.component';




@NgModule({
  declarations: [
    Error404PageComponent,
    LoadingIndicatorComponent,
    LoadingpulsoComponent,






  ],
  exports: [
    LoadingIndicatorComponent,
    Error404PageComponent,
    LoadingpulsoComponent,

  ],
  imports: [
    CommonModule ,
    // Importa CommonModule aquí
  ],
})
export class SharedModule { }
