import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatRadioModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AmplifyAngularModule } from 'aws-amplify-angular';
import { AuthwComponent } from './authw.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, RouterModule,
    MatNativeDateModule, MatRadioModule, AmplifyAngularModule, MatCheckboxModule, MatDatepickerModule, MatButtonModule, MatInputModule
  ], exports: [AuthwComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ],
  declarations: [AuthwComponent]
})
export class AuthwModule { }
