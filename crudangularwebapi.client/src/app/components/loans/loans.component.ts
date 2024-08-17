import { Component, OnInit, TemplateRef } from '@angular/core';
import { Loan } from '../../Loan';
import { LoansService } from '../../loans.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit{
  form: any;
  tittleForm: string;
  valueToBePaid: number | null = null;

  visibilityTable: boolean = true;
  visibilityForm: boolean = false;

  simulateClicked = false;

  modalRef: BsModalRef;
  loanId: number;
  customerId: number;


  loans: Loan[];

  //possívelmente terá mais coisas aqui baseado no que está em customers.component.ts

  //constructor(private loansService: LoansService, private fb: FormBuilder) { }
  constructor(private loansService: LoansService, private modalService: BsModalService) { }

  ngOnInit(): void {
    //this.form = true;
    this.loansService.GetLoans().subscribe(result => {
      this.loans = result;  //obtendo todos os loans e salvando eles em loans do tipo Loan[] (definido ali em cima)
    });
  }

  ShowRegisterForm(): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.tittleForm = 'New Loan';

    this.form = new FormGroup({
      valueObtained: new FormControl(null, Validators.required),
      coin: new FormControl(null, Validators.required),
      conversionRateToReal: new FormControl(null, Validators.required),
      dateOfLoan: new FormControl(null, Validators.required),
      dateOfExpiration: new FormControl(null, Validators.required),
      customerId: new FormControl(null, Validators.required),
      valueToBePaid: new FormControl(null)
    });

    //console.log('Form:', this.form);
  }

  ShowUpdateForm(id): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.loansService.GetLoan(id).subscribe(result => {
      this.tittleForm = `Update ${result.id} ${result.valueObtained}`;
      
      this.form = new FormGroup({
        id: new FormControl(result.id),
        valueObtained: new FormControl(result.valueObtained),
        coin: new FormControl(result.coin),
        conversionRateToReal: new FormControl(result.conversionRateToReal),
        dateOfLoan: new FormControl(result.dateOfLoan),
        dateOfExpiration: new FormControl(result.dateOfExpiration),
        customerId: new FormControl(result.customerId),
        valueToBePaid: new FormControl(result.valueToBePaid)
       });
    });
  }

  SendForm(): void {
    const loan: Loan = this.form.value;

    if (loan.id > 0) {
      this.loansService.PutLoan(loan).subscribe(result => {
        this.visibilityForm = false;
        this.visibilityTable = true;
        alert('Loan successfully updated!')

        this.loansService.GetLoans().subscribe(registers => {
          this.loans = registers;
        });
      });
    } else {
      this.loansService.PostLoan(loan).subscribe(result => {  //aqui posso criar um atributo caso eu receba algo do nosso servidor
        this.visibilityForm = false;
        this.visibilityTable = true;
        alert('Loan successfully registered!')

        this.loansService.GetLoans().subscribe(registers => {
          this.loans = registers;
        });
      });
    }
  }

  //Função da ação ao clicar em Simulate (chama requisição de simulação e trás valor como retorno)
  SimulateLoan(): void {

    this.simulateClicked = true; // Marca que o botão foi clicado

    if (this.form.valid) {
      this.loansService.SimulateLoan(this.form.value).subscribe((result : number)=> {
        this.valueToBePaid = result;
        this.form.patchValue({ valueToBePaid: this.valueToBePaid })
      },
        error => {
          console.error('Error simulating loan', error);
        }
      );
    } else {
      this.form.markAllAsTouched(); // Marca todos os campos para mostrar os erros
    }
  }

  Back(): void {
    this.visibilityTable = true;
    this.visibilityForm = false;
  }

  ShowDeleteConfirmation(id, modalContent: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(modalContent);
    this.loanId = id;
  }

  DeleteLoan(id) {
    this.loansService.DeleteLoan(id).subscribe(result => {
      this.modalRef.hide();
      alert('Loan successfully deleted!');
      this.loansService.GetLoans().subscribe(regiters => {
        this.loans = regiters;
      });
    });
  }
}
