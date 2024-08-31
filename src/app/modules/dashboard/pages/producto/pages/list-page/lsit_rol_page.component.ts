import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductoService } from '../../service/producto.service';

import Swal from 'sweetalert2';
import { DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { Validators } from '@angular/forms';

import { FormStatus } from '../../../customer/interface/form_status.enum';

@Component({
  selector: 'list-page-rol',
  standalone: false,
  templateUrl: './list_rol_page.component.html',
  styleUrl: './list_rol_page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRolPageComponent implements OnInit {
onEditar($event: any) {
throw new Error('Method not implemented.');
}



  onEliminar($event: any) {
    throw new Error('Method not implemented.');
  }



  ngOnInit(): void {
    console.log('Init ListRolPageComponent');
    this.getAllProdcuts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente
  }

  title: string = 'Lista de Productos';

  constructor(private roleService: ProductoService) { }

  // subscription para desuscribirse al destruir el componente
  private subscription: Subscription = new Subscription();

  // Señal para almacenar los datos de los usuarios y obtener
  private _data = signal<any | null>(null);
  public getDataHistory = computed(() => this._data());
  // Señal para almacenar el estado de la petición de guardar un nuevo usuario
  private _statusData = signal<boolean>(false);
  public statusData = computed(() => this._statusData());

  public isPosting = computed(() => this._statusData());

  private formStatus = signal<FormStatus>(FormStatus.isNoPosting);
  public isStatusSolicitudHttp = computed(() => this.formStatus());

  public isLoading = true;

  // Considera iniciar pageIndex y pageSize con valores por defecto si es necesario
  private pageIndex: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  showColumnActions = true;

  readonly configuracionDelFormulario = {
    codRole: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
    authority: ['', [Validators.required, Validators.minLength(3)]],
    status: [true, [Validators.required]],
    id: ['']
  }

  readonly camposDinamicos: DialogData = {

    campos: {
      id: {
        title: 'id',
        tipo: 'input',
      },
      codRole: {
        title: 'Código de Rol',
        tipo: 'input',
      },

      authority: {
        title: 'nombre rol',
        tipo: 'input',
      },
      description: {
        title: 'Descripción',
        tipo: 'textarea',
      },
      status: {
        title: 'Activar Rol',
        tipo: 'checkbox',
        valor: true,
      }
    },
    configuracionDelFormulario: this.configuracionDelFormulario,
  }



  onPageChange(event: { pageIndex: number, pageSize: number, lastPage: number, totalPages: number }) {

  }


  private getAllProdcuts(): void {
    this.isLoading = false;
    this.subscription.add(
      this.roleService.getAllProducts().subscribe({
        next: (response) => {
          console.log("DATA_PRODUCTOS:", response);
          this._data.set(response);
          this.isLoading = true;
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Error en la petición de obtener roles:', error);
          this.isLoading = false;
        }
      }));
  }





  onSave($event: any) {
    console.log('Guardar DESDE EL PADRE Role:', $event);


  }






}
