import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AmplifyAngularModule } from 'aws-amplify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthwModule } from '../Modules/data/plugin/authw/authw.module';

@NgModule({
  imports: [
    CommonModule, AuthwModule, FormsModule, AmplifyAngularModule, MatButtonModule, MatInputModule
  ],
  exports: [AuthComponent],
  declarations: [AuthComponent]
})
export class AuthModule { }
