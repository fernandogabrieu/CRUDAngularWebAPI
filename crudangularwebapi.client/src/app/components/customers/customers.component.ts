import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Customer } from '../../Customer';
import { CustomersService } from '../../customers.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  form: any;
  tittleForm: string;

  customers: Customer[]; //atributo customers para poder exibí-los no formulário

  nameCustomer: string;
  customerId: number;

  visibilityTable: boolean = true;
  visibilityForm: boolean = false;

  modalRef: BsModalRef;

  constructor(private customersService: CustomersService, private modalService: BsModalService) { }

  //inicialização dos componentes
  ngOnInit(): void {

    this.customersService.GetCustomers().subscribe(result => {
      this.customers = result;
    });  //obtendo todos os customers e salvando eles em customers do tipo Customer[] (definida ali em cima)
  }

  ShowRegisterForm(): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.tittleForm = 'Novo Cliente';/*'New Customer';*/

    this.form = new FormGroup({
      name: new FormControl(null),
      lastname: new FormControl(null),
      age: new FormControl(null),
      cpf: new FormControl(null),
      email: new FormControl(null)
    });
  }

  ShowUpdateForm(id): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.customersService.GetCustomer(id).subscribe(result => {
      this.tittleForm = /*`Update*/ `Alterando cadastro de ${result.name} ${result.lastname}`;

      this.form = new FormGroup({
        id: new FormControl(result.id),
        name: new FormControl(result.name),
        lastname: new FormControl(result.lastname),
        age: new FormControl(result.age),
        cpf: new FormControl(result.cpf),
        email: new FormControl(result.email)
      });
    });
  }

  SendForm(): void {
    const customer: Customer = this.form.value;

    if (customer.id > 0) {
      this.customersService.PutCustomer(customer).subscribe(result => {
        this.visibilityForm = false;
        this.visibilityTable = true;
        alert('Customer successfully updated!')

        this.customersService.GetCustomers().subscribe(registers => {
          this.customers = registers;
        });
      });
    } else {
      this.customersService.PostCustomer(customer).subscribe(result => {  //aqui posso criar um atributo caso eu receba algo do nosso servidor
        this.visibilityForm = false;
        this.visibilityTable = true;
        alert('Customer successfully registered!')

        this.customersService.GetCustomers().subscribe(registers => {
          this.customers = registers;
        });
      });
    }
  }

  Back(): void {
    this.visibilityTable = true;
    this.visibilityForm = false;
  }

  ShowDeleteConfirmation(id, nameCustomer, modalContent: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(modalContent);
    this.customerId = id;
    this.nameCustomer = nameCustomer;
  }

  DeleteCustomer(id) {
    this.customersService.DeleteCustomer(id).subscribe(result => {
      this.modalRef.hide();
      alert('Customer successfully deleted!');
      this.customersService.GetCustomers().subscribe(regiters => {
        this.customers = regiters;
      });
    });
  }
}
