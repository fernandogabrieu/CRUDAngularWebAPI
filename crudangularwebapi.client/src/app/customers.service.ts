import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './Customer';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  url = 'https://localhost:7160/api/customers';
  constructor(private http: HttpClient) { }

  //método de buscar todos
  GetCustomers(): Observable<Customer[]> { 
    return this.http.get<Customer[]>(this.url);
  }

  //método de buscar pelo id
  GetCustomer(id: number): Observable<Customer> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.get<Customer>(apiUrl);
  }

  //método de salvar um novo Customer
  PostCustomer(customer: Customer): Observable<any> {
    return this.http.post<Customer>(this.url, customer, httpOptions);
  }

  //método de atualizar Customer existente
  PutCustomer(customer: Customer): Observable<any> {
    return this.http.put<Customer>(this.url, customer, httpOptions);
  }

  //método de deletar Customer
  DeleteCustomer(id: number): Observable<any> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.delete<number>(apiUrl, httpOptions);
  }
}
