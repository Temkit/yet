import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionComponent } from './consumption.component';
import { Routes, RouterModule } from '@angular/router';
import { FormModule } from '../../data/Forms/form/form.module';

const routes: Routes = [
  { path: '', component: ConsumptionComponent }
];

@NgModule({
  imports: [
    CommonModule, FormModule, RouterModule.forChild(routes)
  ],
  declarations: [ConsumptionComponent]
})
export class ConsumptionModule { }
