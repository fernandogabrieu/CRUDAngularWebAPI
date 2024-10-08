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

  simulateOrSaveClicked = false;

  modalRef: BsModalRef;
  loanId: number;
  customerId: number;

  //variável para armazenar a lista de moedas vindas do back-end
  coins: Coin[] = [];

  loans: Loan[];

  today: string;

  installments: number;

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

    this.tittleForm = 'Novo Empréstimo';/*'New Loan';*/

    this.form = new FormGroup({
      valueObtained: new FormControl(null, Validators.required),
      coin: new FormControl(null, Validators.required),
      conversionRateToReal: new FormControl(null, Validators.required),
      dateOfLoan: new FormControl(this.today, Validators.required),
      dateOfExpiration: new FormControl(null),
      customerId: new FormControl(null, Validators.required),
      valueToBePaid: new FormControl(null),
      installments: new FormControl(null, Validators.required)
    });

    // Listener para o campo 'coin'
    this.form.get('coin').valueChanges.subscribe(selectedCoin => {
      if (selectedCoin) {
        this.updateConversionRate(selectedCoin);
      }
    });
    // Listener para atualizar a data de vencimento automaticamente
    this.form.get('installments').valueChanges.subscribe(installments => {
      if (installments) {
        this.updateInstallments();
      }
    });
    // Listener para o campo 'dateOfLoan'
    this.form.get('dateOfLoan').valueChanges.subscribe(() => {
      this.updateExpirationDate();
    });
  }

  ShowUpdateForm(id): void {
    this.visibilityTable = false;
    this.visibilityForm = true;

    this.loansService.GetLoan(id).subscribe(result => {
      this.tittleForm = `Alterando Empréstimo de Id ${result.id}`;

      // Formatando as datas para o formato esperado
      const formattedDateOfLoan = formatDate(result.dateOfLoan, 'yyyy-MM-dd', 'en-US');
      const formattedDateOfExpiration = formatDate(result.dateOfExpiration, 'yyyy-MM-dd', 'en-US');

      this.form = new FormGroup({
        id: new FormControl(result.id),
        valueObtained: new FormControl(result.valueObtained, Validators.required),
        coin: new FormControl(result.coin, Validators.required),
        conversionRateToReal: new FormControl(result.conversionRateToReal, Validators.required),
        dateOfLoan: new FormControl(formattedDateOfLoan, Validators.required),
        installments: new FormControl(result.installments, Validators.required),
        dateOfExpiration: new FormControl(formattedDateOfExpiration),
        customerId: new FormControl(result.customerId, Validators.required),
        valueToBePaid: new FormControl(result.valueToBePaid)
      });



      // Listener para o campo 'coin'
      this.form.get('coin').valueChanges.subscribe(selectedCoin => {
        if (selectedCoin) {
          this.updateConversionRate(selectedCoin);
        }
      });

      // Listener para atualizar a data de vencimento automaticamente
      this.form.get('installments').valueChanges.subscribe(installments => {
        if (installments) {
          this.updateInstallments();
        }
      });

      // Adiciona o listener para o campo 'dateOfLoan'
      this.form.get('dateOfLoan').valueChanges.subscribe(() => {
        this.updateExpirationDate();
      });
    });
  }

  SendForm(): void {
    const loan: Loan = this.form.value;

    this.simulateOrSaveClicked = true; // Marca que o botão foi clicado

    //Verifico se o usuário já existe, se sim, é Update. Se não, é Create
    if (loan.id > 0) {
      this.loansService.PutLoan(loan).subscribe(result => {
        this.visibilityForm = false;
        this.visibilityTable = true;
        this.simulateOrSaveClicked = false;
        alert('Loan successfully updated!')
        this.loansService.GetLoans().subscribe(registers => {
          this.loans = registers;
        });
      });
    } else {
      this.loansService.PostLoan(loan).subscribe(result => {  //aqui posso criar um atributo caso eu receba algo do nosso servidor
        this.visibilityForm = false;
        this.visibilityTable = true;
        this.simulateOrSaveClicked = false;
        alert('Loan successfully registered!')

        this.loansService.GetLoans().subscribe(registers => {
          this.loans = registers;
        });
      });
    }
  }

  //Função da ação ao clicar em Simulate (chama requisição de simulação e trás valor como retorno)
  SimulateLoan(): void {

    this.simulateOrSaveClicked = true; // Marca que o botão foi clicado

    if (this.form.valid) {
      this.loansService.SimulateLoan(this.form.value).subscribe((result : number)=> {
        this.valueToBePaid = parseFloat(result.toFixed(2));//result;
        this.form.patchValue({ valueToBePaid: this.valueToBePaid });

        this.simulateOrSaveClicked = false; // Reinicia o estado após a simulação bem sucedida
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
    this.simulateOrSaveClicked = false;

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

  /*updateExpirationDate(installments: number): void {
    const dateOfLoan = this.form.get('dateOfLoan')?.value;

    if (dateOfLoan && installments > 0) {
      const loanDate = new Date(dateOfLoan);
      loanDate.setMonth(loanDate.getMonth() + installments);
      this.form.patchValue({ dateOfExpiration: formatDate(loanDate, 'yyyy-MM-dd', 'en-US') });
    }
  }*/

  // Atualiza a data mínima de vencimento com base na data do empréstimo e parcelas
  updateExpirationDate() {
    const dateOfLoan = this.form.get('dateOfLoan')?.value;
    const installments = this.form.get('installments')?.value; // Número de parcelas

    if (dateOfLoan) {
      const loanDate = new Date(dateOfLoan);
      const minExpirationDate = new Date(loanDate);

      // Adiciona o número de parcelas (em meses) à data do empréstimo
      minExpirationDate.setMonth(minExpirationDate.getMonth() + installments);

      // Adiciona 1 dia à data calculada para compensar o ajuste de dias
      minExpirationDate.setDate(minExpirationDate.getDate() + 1);

      // Atualiza o campo de data de expiração com a nova data calculada
      this.form.patchValue({ dateOfExpiration: formatDate(minExpirationDate, 'yyyy-MM-dd', 'en-US') });
    }
  }

  // Atualiza a data de expiração sempre que o número de parcelas muda
  updateInstallments() {
    const installments = this.form.get('installments')?.value;
    if (installments) {
      this.updateExpirationDate();
    }
  }
}
