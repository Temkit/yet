import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email.component';
import { Routes, RouterModule } from '@angular/router';
import { DecoratorModule } from '../../data/common/decorator/decorator.module';
import { AutocompleteModule } from '../../data/common/autocomplete/autocomplete.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatSnackBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { TagsInputModule } from '../../data/common/tagsInput/tagsInput.module';
import { EditorModule } from '../../data/plugin/editor/editor.module';

const routes: Routes = [
  { path: '', component: EmailComponent }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, EditorModule, MatProgressSpinnerModule, DecoratorModule, MatTableModule, MatSnackBarModule, AutocompleteModule,
    TagsInputModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, RouterModule.forChild(routes)

  ],
  declarations: [EmailComponent]
})
export class EmailModule { }
