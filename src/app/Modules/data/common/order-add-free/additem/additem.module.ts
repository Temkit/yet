import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditemComponent } from './additem.component';
import { AutocompleteModule } from '../../autocomplete/autocomplete.module';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatDialogModule } from '@angular/material';
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
