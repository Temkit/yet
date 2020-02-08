import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormViewComponent } from './formView.component';
import { FormModule } from '../form/form.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: FormViewComponent }
];

@NgModule({
  imports: [
    CommonModule, FormModule, RouterModule.forChild(routes)
  ],
  declarations: [FormViewComponent]
})
export class FormViewModule { }
