import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { LoansComponent } from './components/loans/loans.component';

const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'loans', component: LoansComponent },
  { path: '', redirectTo: '/loans', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
