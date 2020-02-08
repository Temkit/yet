import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditemComponent } from './additem.component';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatSelectModule } from '@angular/material';
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
