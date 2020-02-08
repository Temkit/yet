import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteTagsInputComponent } from './autocompleteTagsInput.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatChipsModule, MatFormFieldModule,
    MatAutocompleteModule, MatIconModule],
  exports: [AutocompleteTagsInputComponent],
  declarations: [AutocompleteTagsInputComponent]
})
export class AutocompleteTagsInputModule { }
