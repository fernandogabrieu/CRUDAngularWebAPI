import { Component, OnInit, TemplateRef } from '@angular/core';
import { Loan } from '../../Loan';
import { LoansService } from '../../loans.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';

export interface Coin {
  symbol: string;
  coinType: string; // Correspondente ao TipoMoeda no back-end
}

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

  //variável para armazenar a lista de moedas vindas do back-end
  coins: Coin[] = [];

  loans: Loan[];

  today: string;

  minExpirationDate: string | null = null;
  dateError: string | null = null;

  //possívelmente terá mais coisas aqui baseado no que está em customers.component.ts

  //constructor(private loansService: LoansService, private fb: FormBuilder) { }
  constructor(private loansService: LoansService, private modalService: BsModalService) { }

  ngOnInit(): void {
    //this.form = true;
    this.loansService.GetLoans().subscribe(result => {
      this.loans = result;  //obtendo todos os loans e salvando eles em loans do tipo Loan[] (definido ali em cima)
    });

    //Obtenção da lista de moedas do back-end
    this.loansService.GetCoins().subscribe((coins: Coin[]) => {
      this.coins = coins;
    });

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
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

    // Adiciona o listener para o campo 'coin'
    this.form.get('coin').valueChanges.subscribe(selectedCoin => {
      if (selectedCoin) {
        this.updateConversionRate(selectedCoin);
      }
    });
  }

  ShowUpdateForm(id): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.loansService.GetLoan(id).subscribe(result => {
      this.tittleForm = `Update ${result.id} ${result.valueToBePaid}`;

      // Formatando as datas para o formato esperado
      const formattedDateOfLoan = formatDate(result.dateOfLoan, 'yyyy-MM-dd', 'en-US');
      const formattedDateOfExpiration = formatDate(result.dateOfExpiration, 'yyyy-MM-dd', 'en-US');


      this.form = new FormGroup({
        id: new FormControl(result.id),
        valueObtained: new FormControl(result.valueObtained),
        coin: new FormControl(result.coin),
        conversionRateToReal: new FormControl(result.conversionRateToReal),
        dateOfLoan: new FormControl(formattedDateOfLoan),
        dateOfExpiration: new FormControl(formattedDateOfExpiration),
        customerId: new FormControl(result.customerId),
        valueToBePaid: new FormControl(result.valueToBePaid)
       });
    });
  }

  SendForm(): void {
    const loan: Loan = this.form.value;

    const dateOfLoan = new Date(loan.dateOfLoan);
    const dateOfExpiration = new Date(loan.dateOfExpiration);

    // Validar as datas
    if (dateOfLoan < new Date(this.today)) {
      this.dateError = 'Loan date must be equal to or greater than the current date.';
      return;
    }
    if (dateOfExpiration <= dateOfLoan) {
      this.dateError = 'The due date must be greater than the loan date.';
      return;
    }
    if (dateOfExpiration < new Date(dateOfLoan.setMonth(dateOfLoan.getMonth() + 1))) {
      this.dateError = 'The due date must be at least 1 month after the loan date.';
      return;
    }

    this.dateError = null;

    //Verifico se o usuário já existe, se sim, é Update. Se não, é Create
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

  // Método para chamar a API e buscar o valor da moeda
  updateConversionRate(selectedCoin: string) {
  /*
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
    const formattedDate = formatDate(currentDate, 'MM-dd-yyyy', 'en-US');
    

    this.loansService.GetConversionRate(selectedCoin, formattedDate).subscribe(response => {
      if (response && response.value && response.value.length > 0) {
        const rate = response.value[0].cotacaoCompra;
        this.form.patchValue({ conversionRateToReal: rate });
      } else {
        alert('Conversion rate not found for the selected coin.');
      }
    });
  */
    const maxAttempts = 10;  // Máximo de tentativas para buscar a cotação
    let currentDate = new Date();

    // Função recursiva para tentar diferentes datas
    const fetchConversionRate = (attempt: number) => {
      if (attempt > maxAttempts) {
        alert('Could not retrieve conversion rate after many attempts.');
        return;
      }

      const formattedDate = formatDate(currentDate, 'MM-dd-yyyy', 'en-US');

      this.loansService.GetConversionRate(selectedCoin, formattedDate).subscribe(response => {
        if (response && response.value && response.value.length > 0) {
          const rate = response.value[0].cotacaoCompra;
          this.form.patchValue({ conversionRateToReal: rate });
        } else {
          // Se não encontrou cotação, tenta o dia anterior
          currentDate.setDate(currentDate.getDate() - 1);
          fetchConversionRate(attempt + 1);
        }
      }, error => {
        // Em caso de erro na requisição, tenta o dia anterior
        currentDate.setDate(currentDate.getDate() - 1);
        fetchConversionRate(attempt + 1);
      });
    };

    // Começa a tentativa a partir da data atual
    fetchConversionRate(1);
  }

  // Método para atualizar a data mínima de vencimento de acordo com a data de empréstimo
  updateExpirationMinDate() {
    const dateOfLoan = this.form.get('dateOfLoan')?.value;
    if (dateOfLoan) {
      const loanDate = new Date(dateOfLoan);
      const minExpirationDate = new Date(loanDate);
      minExpirationDate.setMonth(minExpirationDate.getMonth() + 1);

      this.minExpirationDate = formatDate(minExpirationDate, 'yyyy-MM-dd', 'en-US');
    }
  }
}
