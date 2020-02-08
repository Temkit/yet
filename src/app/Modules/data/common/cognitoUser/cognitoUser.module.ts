import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CognitoUserComponent } from "./cognitoUser.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatAutocompleteModule
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  exports: [CognitoUserComponent],
  declarations: [CognitoUserComponent]
})
export class CognitoUserModule {}
