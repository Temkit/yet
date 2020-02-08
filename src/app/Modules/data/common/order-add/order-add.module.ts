import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { DecoratorModule } from '../decorator/decorator.module';
import { OrderAddComponent } from './order-add.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SelectModule } from '../select/select.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { AdditemModule } from './additem/additem.module';

@NgModule({
  imports: [CommonModule, FormsModule, MatIconModule, SelectModule,AdditemModule, MatDividerModule, MatStepperModule,
    MatFormFieldModule, MatTableModule, MatInputModule, MatButtonModule, AutocompleteModule, DecoratorModule
  ], exports: [OrderAddComponent],
  declarations: [OrderAddComponent]
})
export class OrderAddModule { }
