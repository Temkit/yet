import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditemComponent } from './additem.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '../../../common/autocomplete/autocomplete.module';
import { SelectModule } from '../../../common/select/select.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, AutocompleteModule, MatFormFieldModule, SelectModule, MatButtonModule, MatInputModule, MatIconModule
  ], exports: [AdditemComponent],
  entryComponents: [AdditemComponent],
  declarations: [AdditemComponent]
})
export class AdditemModule { }
