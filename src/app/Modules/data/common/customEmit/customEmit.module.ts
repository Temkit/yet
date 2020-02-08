import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomEmitComponent } from './customEmit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule
  ], exports: [CustomEmitComponent],
  declarations: [CustomEmitComponent]
})
export class CustomEmitModule { }
