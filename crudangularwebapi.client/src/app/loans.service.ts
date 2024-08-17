import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loan } from './Loan';
import { Observable } from 'rxjs';

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
}
