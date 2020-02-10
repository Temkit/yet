import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { AmplifyAngularModule } from "aws-amplify-angular";
import { AuthwComponent } from "./authw.component";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatNativeDateModule,
    MatRadioModule,
    MatIconModule,
    AmplifyAngularModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule
  ],
  exports: [AuthwComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "fr-FR" }],
  declarations: [AuthwComponent]
})
export class AuthwModule {}
