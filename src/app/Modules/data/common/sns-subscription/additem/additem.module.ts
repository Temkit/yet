import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditemComponent } from './additem.component';
import { AutocompleteModule } from '../../autocomplete/autocomplete.module';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { SelectModule } from '../../select/select.module';
import { FormsModule } from '@angular/forms';
import { FormMiniModule } from '../../../Forms/form-mini/form-mini.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, FormMiniModule,
    AutocompleteModule, MatFormFieldModule, SelectModule, MatButtonModule, MatInputModule, MatIconModule
  ], exports: [AdditemComponent],
  entryComponents: [AdditemComponent],
  declarations: [AdditemComponent]
})
export class AdditemModule { }
