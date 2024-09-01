import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductoService } from '../../service/producto.service';

import Swal from 'sweetalert2';
import { DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { Validators } from '@angular/forms';

import { FormStatus } from '../../../customer/interface/form_status.enum';
import { SuppliersService } from '../../service/suppliers.service';
import { SupplierApi, Suppliers } from '../../interface/suppliers_Api.interface';
import { ProductApi } from '../../interface/producto_api.interface';

@Component({
  selector: 'list-page-rol',
  standalone: false,
  templateUrl: './list_rol_page.component.html',
  styleUrl: './list_rol_page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRolPageComponent implements OnInit {



  ngOnInit(): void {
    console.log('Init ListRolPageComponent');
    this.getAllProdcuts();
    this.loadSuppliers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse al destruir el componente
  }

  title: string = 'Lista de Productos';

  constructor(
    private roleService: ProductoService,
    private supplierService: SuppliersService
  ) { }

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

  public isloading = signal<boolean>(false);

  // Considera iniciar pageIndex y pageSize con valores por defecto si es necesario
  private pageIndex: number = 0;
  pageSize: number = 30;
  totalPages: number = 0;
  showColumnActions = true;

  readonly configuracionDelFormulario = {

    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    unit_price: [0, [Validators.required]],
    stock_units: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
    id_supplier: ['', [Validators.required]],
    id_product: [''],
  }
  // Campos dinámicos para el formulario tiene que ser igual al objeto de la tabla
  // y el objeto de la interfaz de la API
  readonly camposDinamicos: DialogData = {

    campos: {
      id_product: {
        title: 'id',
        tipo: 'input',
      },
      name: {
        title: 'Nombre',
        tipo: 'input',
      },
      category: {
        title: 'Categoria',
        tipo: 'input',
      },
      brand: {
        title: 'Marca',
        tipo: 'input',
      },
      unit_price: {
        title: 'Precio Unitario',
        tipo: 'currency',
      },
      stock_units: {
        title: 'Unidades en Stock',
        tipo: 'number',
      },
      description: {
        title: 'Descripción',
        tipo: 'textarea',
      },
      id_supplier: {
        title: 'Proveedor',
        tipo: 'select',
        opciones: [{ valor: 'no existe', vista: 'no existe' }]
      }
    },
    configuracionDelFormulario: this.configuracionDelFormulario,
  }



  onPageChange(event: { pageIndex: number, pageSize: number, lastPage: number, totalPages: number }) {

  }


  private getAllProdcuts(updateDta:boolean = false): void {
    this.isloading.set(false);
    this.subscription.add(
      this.roleService.getAllProducts().subscribe({
        next: (response) => {
          console.log("DATA_PRODUCTOS:", response);
          this._data.set(response);
          if(updateDta)  this.formStatus.set(FormStatus.isPostingSuccessfully);
          this.isloading.set(true);
        },
        error: (error) => {
          console.log('Error en la petición de obtener productos:', error);
          this.isloading.set(true);
        }
      }));
  }





  onSave($event: ProductApi): void {
    console.log('Guardar DESDE EL PADRE Role:', $event);
    this._saveProduct($event);

  }


  private _saveProduct(product: any): void {

    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isPosting);

    this.subscription.add(
      this.roleService.saveProduct(product).subscribe({
        next: (response: any) => {
          console.log('RESPONSE_SAVE_PRODUCT:', response);
          this.getAllProdcuts();
          Swal.fire({
            title: 'Producto guardado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error: any) => {
          console.log('Error en la petición de guardar producto:', error);
          this._statusData.set(false);
          this.isloading.set(true);
          this.formStatus.set(FormStatus.isNoPosting);
          Swal.fire({
            title: 'Error al guardar el producto',
            text: 'Por favor, intenta de nuevo',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }));



  }


  onEditar($event: any) {
    console.log('Editar DESDE EL PADRE Role:', $event);
    this._editProduct($event);
  }

  private _editProduct(product: any): void {
    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isPosting);

    this.subscription.add(
      this.roleService.updateProduct(product).subscribe({
        next: (response: any) => {
          console.log('RESPONSE_UPDATE_PRODUCT:', response);
          this.getAllProdcuts(true);
          Swal.fire({
            title: 'Producto actualizado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error: any) => {
          console.log('Error en la petición de actualizar producto:', error);
          this._statusData.set(false);
          this.isloading.set(true);
          this.formStatus.set(FormStatus.isNoPosting);
          Swal.fire({
            title: 'Error al actualizar el producto',
            text: 'Por favor, intenta de nuevo',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }));
  }

  onEliminar($event: any) {
    this._deleteProduct($event);
  }

  private _deleteProduct(product: any): void {

    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isDeleted);

    this.subscription.add(
      this.roleService.deleteProduct(product).subscribe({
        next: (response: any) => {
          console.log('RESPONSE_DELETE_PRODUCT:', response);
          this.getAllProdcuts(true);
          Swal.fire({
            title: 'Producto eliminado',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error: any) => {
          console.log('Error en la petición de eliminar producto:', error);
          this._statusData.set(false);
          this.isloading.set(true);
          this.formStatus.set(FormStatus.isNoPosting);
          Swal.fire({
            title: 'Error al eliminar el producto',
            text: 'Por favor, intenta de nuevo',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }));

  }



  private loadSuppliers(): void {
    this.subscription.add(
      this.supplierService.getAllSuppliers().subscribe({
        next: (response: Suppliers) => {

          console.log("DATA_SUPPLIERS:", response);
          const listSupplier = response.map((supplier: any) => ({
            valor: supplier.id_supplier,
            vista: supplier.name
          }));

          console.log("LIST_SUPPLIERS:", listSupplier);
          this.camposDinamicos!.campos!['id_supplier']!.opciones! = listSupplier;



        },
        error: (error) => {
          console.log('Error en la petición de obtener proveedores:', error);
        }
      }));
  }

}
