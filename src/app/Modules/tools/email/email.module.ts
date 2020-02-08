import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email.component';
import { Routes, RouterModule } from '@angular/router';
import { DecoratorModule } from '../../data/common/decorator/decorator.module';
import { AutocompleteModule } from '../../data/common/autocomplete/autocomplete.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
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
