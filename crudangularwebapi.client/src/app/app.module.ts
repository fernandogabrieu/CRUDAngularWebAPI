import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomersService } from './customers.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-bootstrap/modal";
import { CustomersComponent } from './components/customers/customers.component';
import { LoansService } from './loans.service';
import { LoansComponent } from './components/loans/loans.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    LoansComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers: [HttpClientModule, CustomersService, LoansService],
  bootstrap: [AppComponent]
})
export class AppModule { }
