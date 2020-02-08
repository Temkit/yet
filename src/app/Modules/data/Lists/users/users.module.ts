import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Routes, RouterModule } from '@angular/router';
import { DecoratorModule } from '../../common/decorator/decorator.module';
import { TagsInputModule } from '../../common/tagsInput/tagsInput.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutocompleteModule } from '../../common/autocomplete/autocomplete.module';
import { UsersComponent } from './users.component';
import { FormMiniModule } from '../../Forms/form-mini/form-mini.module';

import { AdditemModule } from './additem/additem.module';
import { DialogModule } from '../../common/dialog/dialog.module';
import { MatSnackBarModule } from '@angular/material';
const routes: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  imports: [
    MatButtonModule, AdditemModule, FormMiniModule, MatPaginatorModule, MatProgressSpinnerModule, MatCheckboxModule,
    MatTableModule, MatIconModule, MatFormFieldModule, MatExpansionModule, DialogModule,
    MatInputModule, MatBottomSheetModule, DecoratorModule, MatCardModule,
    CommonModule, FormsModule, ReactiveFormsModule, TagsInputModule, MatSnackBarModule,
    AutocompleteModule, RouterModule.forChild(routes)
  ],
  declarations: [UsersComponent]
})
export class UsersModule { }
