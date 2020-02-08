import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteArrayInputComponent } from './autocompleteArrayInput.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { DecoratorModule } from '../decorator/decorator.module';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule, FormsModule, MatTableModule, MatInputModule, MatButtonModule, AutocompleteModule, DecoratorModule,
  ], exports: [AutocompleteArrayInputComponent],
  declarations: [AutocompleteArrayInputComponent]
})
export class AutocompleteArrayInputModule { }
