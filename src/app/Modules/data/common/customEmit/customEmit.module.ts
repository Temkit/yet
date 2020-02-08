import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomEmitComponent } from './customEmit.component';
import { MatInputModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule
  ], exports: [CustomEmitComponent],
  declarations: [CustomEmitComponent]
})
export class CustomEmitModule { }
