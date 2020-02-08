import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderViewComponent } from './orderView.component';
import { Routes, RouterModule } from '@angular/router';
import { FormModule } from '../form/form.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule, } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  { path: '', component: OrderViewComponent }
];

@NgModule({
  imports: [
    CommonModule, FormModule, MatButtonModule, MatTableModule, MatCardModule, MatIconModule, RouterModule.forChild(routes)
  ],
  declarations: [OrderViewComponent]
})
export class OrderViewModule { }
