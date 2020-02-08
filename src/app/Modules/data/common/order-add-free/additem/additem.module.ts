import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditemComponent } from './additem.component';
import { AutocompleteModule } from '../../autocomplete/autocomplete.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SelectModule } from '../../select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '../../../plugin/editor/editor.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, EditorModule, ReactiveFormsModule, AutocompleteModule, MatFormFieldModule, SelectModule, MatButtonModule, MatInputModule, MatIconModule
  ], exports: [AdditemComponent],
  entryComponents: [AdditemComponent],
  declarations: [AdditemComponent]
})
export class AdditemModule { }
