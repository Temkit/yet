import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateComponent } from './date.component';
import { MatFormFieldModule, MatDatepickerModule, MatInputModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule
  ], exports: [DateComponent],
  declarations: [DateComponent]
})
export class DateModule { }
