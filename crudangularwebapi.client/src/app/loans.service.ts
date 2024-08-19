import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loan } from './Loan';
import { Observable } from 'rxjs';
import { Coin } from './components/loans/loans.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  url = 'https://localhost:7160/api/loans';

  constructor(private http: HttpClient) { }

  //método de buscar todos
  GetLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.url);
  }

  //método de buscar pelo id
  GetLoan(id: number): Observable<Loan> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.get<Loan>(apiUrl);
  }

  //método de salvar um novo Loan
  PostLoan(loan: Loan): Observable<any> {
    return this.http.post<Loan>(this.url, loan, httpOptions);
  }

  //método de atualizar Loan existente
  PutLoan(loan: Loan): Observable<any> {
    return this.http.put<Loan>(this.url, loan, httpOptions);
  }

  //método de deletar Loan
  DeleteLoan(id: number): Observable<any> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.delete<number>(apiUrl, httpOptions);
  }

  //método de simular Loan
  SimulateLoan(loan: Loan): Observable<number>{
    return this.http.post<number>(`${this.url}/simulate`, loan);
  }

  //método para buscar lista de moedas do back-end
  GetCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>(`${this.url}/coins`);
  }

  // Método para buscar a taxa de conversão
  GetConversionRate(coin: string, date: string): Observable<any> {
    const urlBcb = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaAberturaOuIntermediario(codigoMoeda=@codigoMoeda,dataCotacao=@dataCotacao)?@codigoMoeda='${coin}'&@dataCotacao='${date}'&$format=json`;
    return this.http.get(urlBcb);
  }
}
