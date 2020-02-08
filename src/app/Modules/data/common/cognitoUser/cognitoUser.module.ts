import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CognitoUserComponent } from "./cognitoUser.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

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
