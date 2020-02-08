import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsComponent } from './sms.component';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTableModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsInputModule } from '../../data/common/tagsInput/tagsInput.module';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteModule } from '../../data/common/autocomplete/autocomplete.module';
import { DecoratorModule } from '../../data/common/decorator/decorator.module';


const routes: Routes = [
  { path: '', component: SmsComponent }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,DecoratorModule, MatTableModule, MatSnackBarModule, AutocompleteModule,
    TagsInputModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, RouterModule.forChild(routes)
  ], exports: [SmsComponent],
  declarations: [SmsComponent]
})
export class SmsModule { }
