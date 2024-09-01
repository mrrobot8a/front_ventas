import { Component, Inject, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription, delay, map } from 'rxjs';

import { Validators } from '@angular/forms';
import { DialogData } from '../../../../../../shared/components/modals/modal/dialog/dialog.component';
import { FormStatus } from '../../interface/form_status.enum';
import Swal from 'sweetalert2';

import { mapToCustomerModelTable } from '../../helper/service/mappers/CustomerMapper';
import { ProductoService } from '../../../producto/service/producto.service';
import { CustomerService } from '../../service/customer.service';
import { CustomerApi, CustomerModelTable } from '../../interface';
import { DocumentService } from '../../service/Document.service';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-list-page-users',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit, OnDestroy {

  constructor(
    private _roleService: ProductoService,
    private _customerService: CustomerService,
    private _documentService: DocumentService,
  ) { }





  private loadRolesAndInitForm(): void {

    this.subscription.add(
      this._documentService.getDocument().subscribe({
        next: (response: DocumentType[]) => {
          console.log('documentTypes:', response);
          // Ajustar el formato de documentTypes para que coincida con lo que espera opciones
          this.camposDinamicos!.campos!['document_type'].opciones! = response.map((item: any) => ({
            valor: item.id || '',
            vista: item.name || ''
          }));
        },
        error: (error) => { console.error('Error fetching document types:', error); }
      })
    );
  }



  title: string = 'Lista de Clientes';
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

  showColumnActions = true;



  //validaciones de los campos del formulario
  readonly configuracionDelFormulario = {
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required]],
    document: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    document_type: ['', [Validators.required]],
    date_of_birth: ['', [Validators.required]],
    profile_image_url: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],

    id: ['']



  };
  // Campos dinámicos del formulario de registro de usuario
  readonly camposDinamicos: DialogData = {
    campos: {
      id: {
        title: 'id',
        tipo: 'input',
      },
      first_name: {
        title: 'Nombre Completo',
        tipo: 'input',
      },
      last_name: {
        title: 'Apellido Completo',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }]
      },
      document: {
        title: 'Documento',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },
      document_type: {
        title: 'Tipo de Documento',
        tipo: 'select',
        opciones: [{ valor: 'no existe', vista: 'no existe' }]
      },
      address: {
        title: 'Dirección',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },
      date_of_birth: {
        title: 'Fecha de nacimiento',
        tipo: 'date',
        validaciones: [{ tipo: 'required' }]
      },
      phone: {
        title: 'Número de teléfono',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },
      profile_image_url: {
        title: 'Url Imagen de perfil',
        tipo: 'input',
        validaciones: [{ tipo: 'required' }, { tipo: 'minLength', valor: 2 }]
      },


    }
    ,
    configuracionDelFormulario: this.configuracionDelFormulario
  };




  ngOnInit(): void {

    this.loadCustomerData();
    this.loadRolesAndInitForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }




  onPageChange(event: any) {
    console.log('event:', event);
  }

  onSave(event: CustomerApi) {
    console.log('event:', event);

    event.date_of_birth = new DatePipe('en-US').transform(event.date_of_birth, 'yyyy-MM-dd')!;
    // Asegúrate de que document_type sea un arreglo
    const documentTypes = Array.isArray(event.document_type)
      ? event.document_type
      : [event.document_type];

    // Obtener el primer elemento del arreglo
    event.document_type = documentTypes[0];


    console.log('event:', event);
    this._saveCustomer(event);
  }


  private _saveCustomer(user: any) {
    console.log('saveUser:', user);


    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isPosting);

    this.subscription.add(
      this._customerService.saveCustomer(user).subscribe({
        next: (response) => {
          console.log('response:', response);
          if (response) {

            const currentUsers = this._data() ? this._data().slice() : [];
            currentUsers.unshift(response);
            this._data.set(currentUsers);
          }
          this.formStatus.set(FormStatus.isPostingSuccessfully);
          this.isloading.set(true);
        },
        error: (error) => {
          console.error('Error fetching history:', error);
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 5000);
          this.isloading.set(false);
          this.formStatus.set(FormStatus.isPostingFailed);
        }
      })
    );
  }


  private loadCustomerData(updateDta?:boolean): void {
    this.isloading.set(false);
    this.subscription.add(
      this._customerService.getAllCustomers().subscribe({
        next: (response) => {
          this._data.set(response);
          this.isloading.set(true);
          if(updateDta)  this.formStatus.set(FormStatus.isPostingSuccessfully);

        },
        error: (error) => {
          console.log('Error fetching history:', error);
          localStorage.clear();
          if (error.status === 0 || error.message === "Error en el servidor") {
            Swal.fire({
              title: 'Error',
              text: 'Error en el servidor , intentelo mas tarde...',
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          if (error.status === 400) {
            Swal.fire({
              title: 'Error',
              text: error.error.message,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          if (error.status === 403) {
            Swal.fire({
              title: 'Error',
              text: 'Vuelva a iniciar sesión...',
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              showCloseButton: true,
            });
          }
          this.isloading.set(false);
        }
      }));
  }




  onEditar(event: CustomerModelTable) {
    console.log('Editar DESDE EL PADRE:', event);

    console.log('event:', event);
    // event.roles = mapRoleFromApiToRole(event.roles);
    console.log('event:', event);
    this._editCustomer(event);
    // // Lógica para manejar la edición


  }

  private _editCustomer(user: any) {
    console.log('saveUser:', user);


    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isPosting);

    this.subscription.add(
      this._customerService.updateCustomer(user).subscribe({
        next: (response) => {
          console.log('response:', response);
          if (response) {

            const currentUsers = this._data() ? this._data().slice() : [];
            const editedUserIndex = currentUsers.findIndex((u: { id: any; }) => u.id === user.id);
            if (editedUserIndex !== -1) {
              currentUsers[editedUserIndex] = response;
              this._data.set(currentUsers);
            }
          }
          this.formStatus.set(FormStatus.isPostingSuccessfully);
          this.isloading.set(true);
        },
        error: (error) => {
          console.error('Error fetching history:', error);
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 5000);
          this.isloading.set(false);
          this.formStatus.set(FormStatus.isPostingFailed);
        }
      })
    );
  }

  onEliminar(row: any) {
    console.log('Eliminar DESDE EL PADRE:', row);
    // Lógica para manejar la eliminación
    this._deleteCustomer(row);
  }

  private _deleteCustomer(user: any) {
    console.log('saveUser:', user);
    this._statusData.set(true);
    this.isloading.set(false);
    this.formStatus.set(FormStatus.isDeleted);
    // Lógica para guardar el nuevo usuario
    this.subscription.add(
      this._customerService.deleteCustomer(user).subscribe({
        next: (response) => {
          console.log('response:', response);
          if (response) {
            this.loadCustomerData(true);
          }

        },
        error: (error) => {
          console.error('Error fetching history:', error);
          setTimeout(() => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 2500
            });
          }, 5000);
          this.isloading.set(false);
          this.formStatus.set(FormStatus.isPostingFailed);
        },
      }),
    );
  }


}




